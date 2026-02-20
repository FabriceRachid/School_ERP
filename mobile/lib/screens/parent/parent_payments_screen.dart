import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/data_provider.dart';
import '../../widgets/navigation_widgets.dart';
import '../../theme/app_theme.dart';

class ParentPaymentsScreen extends StatefulWidget {
  const ParentPaymentsScreen({super.key});

  @override
  State<ParentPaymentsScreen> createState() => _ParentPaymentsScreenState();
}

class _ParentPaymentsScreenState extends State<ParentPaymentsScreen> {
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
    final dataProvider = Provider.of<DataProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    _ensureSelectedChild(dataProvider);
    final student = dataProvider.getStudentById(_selectedChildId);
    final payments = dataProvider.getPaymentsForStudent(_selectedChildId);

    if (student == null) return const Scaffold(body: Center(child: Text('Erreur')));

    // Calculate totals
    final totalDue = payments.fold<double>(0, (sum, payment) => sum + payment.amount);
    final totalPaid = payments.fold<double>(0, (sum, payment) => sum + payment.paidAmount);
    final remaining = totalDue - totalPaid;
    final paymentPercent = totalDue > 0 ? ((totalPaid / totalDue) * 100).round() : 0;

    String formatCurrency(double amount) => '${amount.round().toString()} FCFA';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Paiements & Scolarité'),
        backgroundColor: AppTheme.primary,
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await dataProvider.syncWithBackend(authProvider.accessToken);
          if (mounted) setState(() {});
        },
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
                      'Paiements & Scolarité',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${student.firstName} — ${student.className}',
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
                    // Summary card
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppTheme.primary,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Solde restant',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.white.withOpacity(0.7),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            formatCurrency(remaining),
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: Container(
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: FractionallySizedBox(
                                    alignment: Alignment.centerLeft,
                                    widthFactor: paymentPercent / 100,
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                '$paymentPercent%',
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Payé : ${formatCurrency(totalPaid)}',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.white.withOpacity(0.8),
                                ),
                              ),
                              Text(
                                'Total : ${formatCurrency(totalDue)}',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.white.withOpacity(0.8),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Payments history title
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Historique des paiements',
                        style: AppTheme.heading3,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Payments list
                    Column(
                      children: payments.map((payment) {
                        final statusColor = AppTheme.getStatusColor(payment.status);
                        
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: Theme.of(context).dividerColor,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: statusColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  Icons.credit_card,
                                  size: 16,
                                  color: statusColor,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      payment.label,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    Text(
                                      'Échéance : ${payment.dueDate.toString().substring(0, 10)}',
                                      style: AppTheme.caption,
                                    ),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    formatCurrency(payment.paidAmount),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    '/ ${formatCurrency(payment.amount)}',
                                    style: AppTheme.caption,
                                  ),
                                ],
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
}
