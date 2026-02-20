import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../providers/data_provider.dart';
import '../../widgets/navigation_widgets.dart';
import '../../widgets/custom_widgets.dart';
import '../../theme/app_theme.dart';

class ParentMoreScreen extends StatefulWidget {
  const ParentMoreScreen({super.key});

  @override
  State<ParentMoreScreen> createState() => _ParentMoreScreenState();
}

class _ParentMoreScreenState extends State<ParentMoreScreen> {
  String _selectedChildId = 's1';

  void _ensureSelectedChild(DataProvider dataProvider) {
    final students = dataProvider.students;
    if (students.isEmpty) return;
    final exists = students.any((s) => s.id == _selectedChildId);
    if (!exists) {
      _selectedChildId = students.first.id;
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final dataProvider = Provider.of<DataProvider>(context);
    _ensureSelectedChild(dataProvider);
    final student = dataProvider.getStudentById(_selectedChildId);
    final absences = [];
    final notifications = dataProvider.notifications;

    if (student == null) return const Scaffold(body: Center(child: Text('Erreur')));

    const totalPeriods = 400;
    final absentPeriods = absences.length * 4;
    final presenceRate = ((totalPeriods - absentPeriods) / totalPeriods * 100).round();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Plus'),
        backgroundColor: AppTheme.primary,
      ),
      body: RefreshIndicator(
        onRefresh: () async => setState(() {}),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
                    Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardColor,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Theme.of(context).dividerColor),
                      ),
                      child: Column(
                        children: [
                          _buildQuickLink(
                            icon: Icons.credit_card,
                            label: 'Paiements & Scolarité',
                            color: AppTheme.success,
                            onTap: () => context.push('/parent/payments'),
                          ),
                          const Divider(height: 1),
                          _buildQuickLink(
                            icon: Icons.calendar_month,
                            label: 'Absences & Présences',
                            color: AppTheme.warning,
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Fonctionnalité à venir')),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Absences — ${student.firstName}',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        ChildSelector(
                selectedId: _selectedChildId,
                onSelect: (id) => setState(() => _selectedChildId = id),
                children: dataProvider.students
                    .map((s) => {'id': s.id, 'name': '${s.firstName} ${s.lastName}'})
                    .toList(),
              ),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Theme.of(context).dividerColor),
                          ),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Taux de présence', style: AppTheme.caption),
                                  Text(
                                    '$presenceRate%',
                                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.success),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Container(
                                height: 8,
                                decoration: BoxDecoration(
                                  color: Colors.grey[300],
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: FractionallySizedBox(
                                  alignment: Alignment.centerLeft,
                                  widthFactor: presenceRate / 100,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color: AppTheme.success,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              const Column(
                                children: [
                                  _AbsenceItem(date: '10/01/2026', periods: 4, reason: 'Maladie', justified: true),
                                  _AbsenceItem(date: '24/01/2026', periods: 2, reason: 'Non justifiée', justified: false),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Notifications',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        Column(
                          children: notifications.take(5).map((notification) {
                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              decoration: BoxDecoration(
                                color: Theme.of(context).cardColor,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: notification.read ? Theme.of(context).dividerColor : AppTheme.primary.withOpacity(0.3),
                                ),
                              ),
                              child: InkWell(
                                borderRadius: BorderRadius.circular(12),
                                onTap: () async {
                                  if (!notification.read) {
                                    await dataProvider.markNotificationAsRead(
                                      notification.id,
                                      accessToken: authProvider.accessToken,
                                    );
                                  }
                                },
                                child: Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Icon(
                                        Icons.notifications,
                                        size: 16,
                                        color: notification.read ? Colors.grey : AppTheme.primary,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(notification.title, style: const TextStyle(fontWeight: FontWeight.w500)),
                                            Text(
                                              notification.message,
                                              style: AppTheme.caption,
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            Text(notification.date.toString().substring(0, 10), style: AppTheme.caption),
                                          ],
                                        ),
                                      ),
                                      if (!notification.read)
                                        Container(
                                          width: 8,
                                          height: 8,
                                          decoration: const BoxDecoration(color: AppTheme.primary, shape: BoxShape.circle),
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    PrimaryButton(
                      onPressed: () {
                        authProvider.logout();
                        context.go('/login');
                      },
                      text: 'Se déconnecter',
                      icon: Icons.logout,
                      width: double.infinity,
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

  Widget _buildQuickLink({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Icon(icon, color: color),
      title: Text(label),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
    );
  }
}

class _AbsenceItem extends StatelessWidget {
  final String date;
  final int periods;
  final String reason;
  final bool justified;

  const _AbsenceItem({
    required this.date,
    required this.periods,
    required this.reason,
    required this.justified,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.calendar_month, size: 16, color: justified ? AppTheme.success : AppTheme.warning),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(date),
                  Text('$periods heures — $reason', style: AppTheme.caption),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: justified ? AppTheme.success.withOpacity(0.1) : AppTheme.warning.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              justified ? 'Justifiée' : 'Non justifiée',
              style: TextStyle(
                fontSize: 10,
                color: justified ? AppTheme.success : AppTheme.warning,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}






