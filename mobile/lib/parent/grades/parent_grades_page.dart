import 'package:flutter/material.dart';

class ParentGradesPage extends StatelessWidget {
  const ParentGradesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Notes de l’enfant")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _GradeTile("Mathématiques", "15 / 20"),
          _GradeTile("Français", "13 / 20"),
          _GradeTile("Physique", "17 / 20"),
        ],
      ),
    );
  }
}

class _GradeTile extends StatelessWidget {
  final String subject;
  final String grade;

  const _GradeTile(this.subject, this.grade);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(subject),
        trailing: Text(
          grade,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}