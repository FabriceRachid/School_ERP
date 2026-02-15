class Student {
  final String id;
  final String firstName;
  final String lastName;
  final String className;
  final String level;
  final String photo;
  final double averageGrade;
  final int rank;
  final int totalStudents;

  Student({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.className,
    required this.level,
    required this.photo,
    required this.averageGrade,
    required this.rank,
    required this.totalStudents,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      className: json['class'] as String,
      level: json['level'] as String,
      photo: json['photo'] as String,
      averageGrade: (json['averageGrade'] as num).toDouble(),
      rank: json['rank'] as int,
      totalStudents: json['totalStudents'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'class': className,
      'level': level,
      'photo': photo,
      'averageGrade': averageGrade,
      'rank': rank,
      'totalStudents': totalStudents,
    };
  }

  String get fullName => '$firstName $lastName';
}