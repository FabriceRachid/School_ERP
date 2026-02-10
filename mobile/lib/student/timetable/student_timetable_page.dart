import 'package:flutter/material.dart';

class StudentTimetablePage extends StatelessWidget {
  const StudentTimetablePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Emploi du temps"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _DaySchedule(
            day: "Lundi",
            courses: [
              "08h - 10h : Mathématiques",
              "10h - 12h : Physique",
            ],
          ),
          _DaySchedule(
            day: "Mardi",
            courses: [
              "08h - 10h : Français",
              "10h - 12h : SVT",
            ],
          ),
          _DaySchedule(
            day: "Mercredi",
            courses: [
              "08h - 11h : Informatique",
            ],
          ),
        ],
      ),
    );
  }
}

class _DaySchedule extends StatelessWidget {
  final String day;
  final List<String> courses;

  const _DaySchedule({
    required this.day,
    required this.courses,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              day,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ...courses.map(
                  (course) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Text("• $course"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}