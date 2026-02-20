import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../providers/data_provider.dart';
import '../../widgets/navigation_widgets.dart';
import '../../widgets/custom_widgets.dart';
import '../../theme/app_theme.dart';

class StudentMoreScreen extends StatelessWidget {
  const StudentMoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final dataProvider = Provider.of<DataProvider>(context);
    final students = dataProvider.students;
    if (students.isEmpty) return const Scaffold(body: Center(child: Text('Aucun élève disponible')));
    final student = students.first;
    final announcements = [
      {
        'title': 'Journée portes ouvertes',
        'content': 'L\'école organise une journée portes ouvertes le samedi 15 février 2026. Tous les parents et élèves sont invités à participer.',
        'date': '2026-02-10',
        'author': 'Direction',
        'important': true,
        'target': 'school'
      },
      {
        'title': 'Compétition inter-classes',
        'content': 'Une compétition sportive inter-classes aura lieu la semaine du 24 février. Les inscriptions sont ouvertes auprès du professeur d\'EPS.',
        'date': '2026-02-08',
        'author': 'M. Diarra',
        'important': false,
        'target': 'school'
      },
    ]; // Mock data

    return AppScaffold(
      title: 'Plus',
      child: RefreshIndicator(
        onRefresh: () async {},
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 48, 20, 16),
                child: Text(
                  'Plus',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    // Profile card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardColor,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: Theme.of(context).dividerColor,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 56,
                            height: 56,
                            decoration: BoxDecoration(
                              color: Theme.of(context).highlightColor,
                              borderRadius: BorderRadius.circular(28),
                            ),
                            child: const Icon(
                              Icons.person,
                              size: 24,
                              color: AppTheme.primary,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${student.firstName} ${student.lastName}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                Text(
                                  '${student.className} — ${student.level}',
                                  style: AppTheme.caption,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Announcements section
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Toutes les annonces',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Announcements list
                    Column(
                      children: announcements.map((announcement) {
                        final isImportant = announcement['important'] as bool;
                        final target = announcement['target'] as String;
                        final date = announcement['date'] as String;
                        
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isImportant
                                  ? AppTheme.primary.withOpacity(0.3)
                                  : Theme.of(context).dividerColor,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    isImportant ? Icons.star : Icons.campaign,
                                    size: 14,
                                    color: isImportant ? AppTheme.warning : Colors.grey,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    '${target == 'school' ? 'École' : 'Classe'} · ${DateTime.parse(date).toString().substring(0, 10)}',
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                announcement['title'] as String,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                announcement['content'] as String,
                                style: AppTheme.caption,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '— ${announcement['author']}',
                                style: AppTheme.caption,
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

