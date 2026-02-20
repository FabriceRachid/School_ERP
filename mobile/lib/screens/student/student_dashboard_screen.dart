import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../providers/data_provider.dart';
import '../../widgets/navigation_widgets.dart';
import '../../widgets/custom_widgets.dart';
import '../../theme/app_theme.dart';

class StudentDashboardScreen extends StatelessWidget {
  const StudentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final dataProvider = Provider.of<DataProvider>(context);

    final students = dataProvider.students;
    if (students.isEmpty) {
      return const Scaffold(
        body: Center(child: Text('Aucun élève disponible')),
      );
    }

    final student = students.first;
    final studentId = student.id;
    final subjects = dataProvider.getSubjectsForStudent(studentId);
    final schedule = dataProvider.getScheduleForStudent(studentId);

    final now = DateTime.now();
    final dayIndex = (now.weekday >= 1 && now.weekday <= 5) ? now.weekday - 1 : 0;
    final todaySchedule = schedule.where((s) => s.day == dayIndex).toList()
      ..sort((a, b) => a.startTime.compareTo(b.startTime));

    final latestGrades = subjects
        .expand((subject) => subject.grades.map((grade) => {
              'subject': subject.name,
              'grade': grade,
            }))
        .toList()
      ..sort((a, b) => DateTime.parse((b['grade'] as dynamic).date.toString())
          .compareTo(DateTime.parse((a['grade'] as dynamic).date.toString())));

    return AppScaffold(
      title: 'Tableau de bord',
      child: RefreshIndicator(
        onRefresh: () async {
          await dataProvider.syncWithBackend(authProvider.accessToken);
        },
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
                decoration: BoxDecoration(
                  color: AppTheme.primary,
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(24),
                    bottomRight: Radius.circular(24),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Bonjour, ${authProvider.userName}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${student.className} — ${student.level}',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Moyenne générale', style: TextStyle(color: Colors.white70, fontSize: 12)),
                              Text(
                                '${student.averageGrade.toStringAsFixed(1)}/20',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            '${student.rank}e / ${student.totalStudents}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    _sectionCard(
                      title: 'Cours aujourd\'hui',
                      actionLabel: 'Semaine',
                      onAction: () => context.push('/student/schedule'),
                      child: todaySchedule.isEmpty
                          ? const Padding(
                              padding: EdgeInsets.all(16),
                              child: Text('Pas de cours aujourd\'hui', style: TextStyle(color: Colors.grey)),
                            )
                          : Column(
                              children: todaySchedule.map((slot) {
                                return ListTile(
                                  contentPadding: EdgeInsets.zero,
                                  leading: const Icon(Icons.calendar_today, size: 16),
                                  title: Text(slot.subject),
                                  subtitle: Text('${slot.startTime} - ${slot.endTime}'),
                                  trailing: Text(slot.room),
                                );
                              }).toList(),
                            ),
                    ),
                    const SizedBox(height: 12),
                    _sectionCard(
                      title: 'Dernières notes',
                      actionLabel: 'Tout voir',
                      onAction: () => context.push('/student/grades'),
                      child: latestGrades.isEmpty
                          ? const Padding(
                              padding: EdgeInsets.all(16),
                              child: Text('Aucune note', style: TextStyle(color: Colors.grey)),
                            )
                          : Column(
                              children: latestGrades.take(3).map((item) {
                                final grade = item['grade'] as dynamic;
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          '${item['subject']} — ${grade.label}',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      GradeBadge(grade: grade.value, outOf: grade.outOf),
                                    ],
                                  ),
                                );
                              }).toList(),
                            ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionCard({
    required String title,
    required String actionLabel,
    required VoidCallback onAction,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
              TextButton(onPressed: onAction, child: Text(actionLabel)),
            ],
          ),
          child,
        ],
      ),
    );
  }
}
