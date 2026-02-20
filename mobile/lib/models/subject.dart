import 'grade.dart';

class Subject {
  final String id;
  final String name;
  final String teacher;
  final double average;
  final int coefficient;
  final List<Grade> grades;

  Subject({
    required this.id,
    required this.name,
    required this.teacher,
    required this.average,
    required this.coefficient,
    required this.grades,
  });

  factory Subject.fromJson(Map<String, dynamic> json) {
    return Subject(
      id: json['id'] as String,
      name: json['name'] as String,
      teacher: json['teacher'] as String,
      average: (json['average'] as num).toDouble(),
      coefficient: json['coefficient'] as int,
      grades: (json['grades'] as List)
          .map((grade) => Grade.fromJson(grade))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'teacher': teacher,
      'average': average,
      'coefficient': coefficient,
      'grades': grades.map((grade) => grade.toJson()).toList(),
    };
  }
}