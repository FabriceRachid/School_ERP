import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:path_provider/path_provider.dart';
import 'package:open_filex/open_filex.dart';
import '../../providers/data_provider.dart';
import '../../widgets/navigation_widgets.dart';
import '../../widgets/custom_widgets.dart';
import '../../theme/app_theme.dart';

class ParentGradesScreen extends StatefulWidget {
  const ParentGradesScreen({super.key});

  @override
  State<ParentGradesScreen> createState() => _ParentGradesScreenState();
}

class _ParentGradesScreenState extends State<ParentGradesScreen> {
  String _selectedChildId = 's1';
  String? _expandedSubjectId;

  void _ensureSelectedChild(DataProvider dataProvider) {
    final students = dataProvider.students;
    if (students.isEmpty) return;
    final exists = students.any((s) => s.id == _selectedChildId);
    if (!exists) {
      _selectedChildId = students.first.id;
    }
  }

  Future<void> _downloadBulletinTxt({
    required String studentName,
    required String className,
    required List<dynamic> subjects,
  }) async {
    final buffer = StringBuffer();
    buffer.writeln('BULLETIN SCOLAIRE');
    buffer.writeln('==============================');
    buffer.writeln('Eleve: $studentName');
    buffer.writeln('Classe: $className');
    buffer.writeln('Date: ${DateTime.now().toIso8601String()}');
    buffer.writeln('');
    buffer.writeln('MATIERE | MOYENNE | COEF');
    buffer.writeln('------------------------------');
    for (final s in subjects) {
      buffer.writeln('${s.name} | ${s.average.toStringAsFixed(2)} | ${s.coefficient}');
    }

    final dir = await getApplicationDocumentsDirectory();
    final fileName = 'bulletin_${studentName.replaceAll(' ', '_')}_${DateTime.now().millisecondsSinceEpoch}.txt';
    final file = File('${dir.path}/$fileName');
    await file.writeAsString(buffer.toString());
    await OpenFilex.open(file.path);
  }

  @override
  Widget build(BuildContext context) {
    final dataProvider = Provider.of<DataProvider>(context);
    _ensureSelectedChild(dataProvider);
    final student = dataProvider.getStudentById(_selectedChildId);
    final subjects = dataProvider.getSubjectsForStudent(_selectedChildId);

    if (student == null) return const Scaffold(body: Center(child: Text('Erreur')));

    return AppScaffold(
      title: 'Notes & Bulletins',
      child: RefreshIndicator(
        onRefresh: () async => setState(() {}),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 48, 20, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Notes & Bulletins',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Résultats de ${student.firstName}',
                      style: AppTheme.caption,
                    ),
                  ],
                ),
              ),

              // Child selector
              ChildSelector(
                selectedId: _selectedChildId,
                onSelect: (id) => setState(() => _selectedChildId = id),
                children: dataProvider.students
                    .map((s) => {'id': s.id, 'name': '${s.firstName} ${s.lastName}'})
                    .toList(),
              ),
              const SizedBox(height: 16),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    // Simple chart placeholder
                    CustomCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Moyennes par matière',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          // Placeholder for chart
                          Container(
                            height: 140,
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Center(
                              child: Text(
                                'Graphique des moyennes\n(Flutter Chart à implémenter)',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Download button
                    PrimaryButton(
                      onPressed: () async {
                        await _downloadBulletinTxt(
                          studentName: '${student.firstName} ${student.lastName}',
                          className: student.className,
                          subjects: subjects,
                        );
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Bulletin TXT telecharge et ouvert')),
                          );
                        }
                      },
                      text: 'Télécharger le bulletin (TXT)',
                      icon: Icons.download,
                      width: double.infinity,
                    ),
                    const SizedBox(height: 16),

                    // Subjects list
                    Column(
                      children: subjects.map((subject) {
                        final isExpanded = _expandedSubjectId == subject.id;
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Theme.of(context).dividerColor),
                          ),
                          child: Column(
                            children: [
                              // Subject header
                              ListTile(
                                onTap: () => setState(() {
                                  _expandedSubjectId = isExpanded ? null : subject.id;
                                }),
                                leading: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: Theme.of(context).highlightColor,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(Icons.book, size: 20),
                                ),
                                title: Text(
                                  subject.name,
                                  style: const TextStyle(fontWeight: FontWeight.bold),
                                ),
                                subtitle: Text('${subject.teacher} · Coef ${subject.coefficient}'),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      '${subject.average.toStringAsFixed(1)}/20',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.getGradeColor(subject.average),
                                      ),
                                    ),
                                    Icon(
                                      isExpanded ? Icons.expand_less : Icons.expand_more,
                                      color: Colors.grey,
                                    ),
                                  ],
                                ),
                              ),
                              // Grades details
                              if (isExpanded)
                                Container(
                                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                                  decoration: const BoxDecoration(
                                    border: Border(top: BorderSide(color: Colors.grey)),
                                  ),
                                  child: Column(
                                    children: subject.grades.map((grade) {
                                      return Padding(
                                        padding: const EdgeInsets.symmetric(vertical: 8),
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    grade.label,
                                                    style: const TextStyle(fontWeight: FontWeight.w500),
                                                  ),
                                                  Text(
                                                    '${DateTime.parse(grade.date.toString()).toString().substring(0, 10)} · ${_getGradeTypeFrench(grade.type)}',
                                                    style: AppTheme.caption,
                                                  ),
                                                ],
                                              ),
                                            ),
                                            GradeBadge(
                                              grade: grade.value,
                                              outOf: grade.outOf,
                                            ),
                                          ],
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getGradeTypeFrench(String type) {
    switch (type) {
      case 'controle':
        return 'Contrôle';
      case 'examen':
        return 'Examen';
      case 'devoir':
        return 'Devoir';
      default:
        return type;
    }
  }
}
