import 'package:flutter/material.dart';

class ParentTimetablePage extends StatelessWidget {
  const ParentTimetablePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Emploi du temps")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _TimetableTile("Lundi", "Maths – Physique"),
          _TimetableTile("Mardi", "Français – SVT"),
        ],
      ),
    );
  }
}

class _TimetableTile extends StatelessWidget {
  final String day;
  final String courses;

  const _TimetableTile(this.day, this.courses);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(day),
        subtitle: Text(courses),
      ),
    );
  }
}