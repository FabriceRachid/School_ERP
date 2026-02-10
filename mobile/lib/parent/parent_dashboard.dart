import 'package:flutter/material.dart';
import 'grades/parent_grades_page.dart';
import 'payments/parent_payments_page.dart';
import 'timetable/parent_timetable_page.dart';

class ParentDashboard extends StatelessWidget {
  const ParentDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text
        ("Parent – EduFaso",
        style: TextStyle(
          fontWeight: FontWeight.bold,
        ),
      ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            _DashboardCard(
              title: "Child's Notes",
              icon: Icons.grade,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ParentGradesPage()),
              ),
            ),
            _DashboardCard(
              title: "Payments",
              icon: Icons.payment,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ParentPaymentsPage()),
              ),
            ),
            _DashboardCard(
              title: "Schedule",
              icon: Icons.schedule,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ParentTimetablePage()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _DashboardCard({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.blue.withOpacity(0.1),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: Colors.blue),
            const SizedBox(height: 10),
            Text(title, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}