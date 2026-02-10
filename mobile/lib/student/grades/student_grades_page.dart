import 'package:flutter/material.dart';

class StudentGradesPage extends StatelessWidget {
  const StudentGradesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Mes notes"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _GradeCard(subject: "Mathématiques", grade: "16 / 20"),
          _GradeCard(subject: "Français", grade: "14 / 20"),
          _GradeCard(subject: "Physique", grade: "17 / 20"),
          _GradeCard(subject: "SVT", grade: "15 / 20"),
        ],
      ),
    );
  }
}

class _GradeCard extends StatelessWidget {
  final String subject;
  final String grade;

  const _GradeCard({
    required this.subject,
    required this.grade,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: const Icon(Icons.book),
        title: Text(subject),
        trailing: Text(
          grade,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ),
    );
  }
}