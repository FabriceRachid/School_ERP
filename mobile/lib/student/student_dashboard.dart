import 'package:flutter/material.dart';
import 'grades/student_grades_page.dart';
import 'timetable/student_timetable_page.dart';
import 'notifications/notifications_page.dart';

class StudentDashboard extends StatelessWidget {
  const StudentDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Student – EduFaso",
        style: TextStyle(
          fontWeight: FontWeight.bold,
        ),)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            _Card("My notes", Icons.grade, () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StudentGradesPage()),
              );
            }),
            _Card("Schedule", Icons.schedule, () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StudentTimetablePage()),
              );
            }),
            _Card("Notifications", Icons.notifications, () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationsPage()),
              );
            }),
          ],
        ),
      ),
    );
  }
}

class _Card extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _Card(this.title, this.icon, this.onTap);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.green.withOpacity(0.12),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: Color(0xFFF2B14A)),
            const SizedBox(height: 10),
            Text(title, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}