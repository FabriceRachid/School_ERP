import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/data_provider.dart';
import '../../widgets/navigation_widgets.dart';
import '../../widgets/custom_widgets.dart';
import '../../theme/app_theme.dart';

class StudentGradesScreen extends StatefulWidget {
  const StudentGradesScreen({super.key});

  @override
  State<StudentGradesScreen> createState() => _StudentGradesScreenState();
}

class _StudentGradesScreenState extends State<StudentGradesScreen> {
  String? _expandedSubjectId = null;

  @override
  Widget build(BuildContext context) {
    final dataProvider = Provider.of<DataProvider>(context);
    final students = dataProvider.students;
    if (students.isEmpty) return const Scaffold(body: Center(child: Text('Aucun élève disponible')));
    final student = students.first;
    final studentId = student.id;
    final subjects = dataProvider.getSubjectsForStudent(studentId);

    return AppScaffold(
      title: 'Mes Notes',
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
                      'Mes Notes',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${student.className} — Moyenne : ${student.averageGrade.toStringAsFixed(1)}/20',
                      style: AppTheme.caption,
                    ),
                  ],
                ),
              ),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    // Chart placeholder
                    CustomCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Évolution des moyennes',
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
                                'Graphique d\'évolution\n(Flutter Chart à implémenter)',
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
