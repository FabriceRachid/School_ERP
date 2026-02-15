import 'package:flutter/material.dart';
import '../models/student.dart';
import '../models/subject.dart';
import '../models/grade.dart';
import '../models/schedule_slot.dart';
import '../models/payment.dart';
import '../models/notification.dart';
import '../services/backend_api.dart';

class DataProvider extends ChangeNotifier {
  List<Student> _students = [
    Student(
      id: 's1',
      firstName: 'Amina',
      lastName: 'Diallo',
      className: '3ème A',
      level: 'Collège',
      photo: '',
      averageGrade: 14.5,
      rank: 3,
      totalStudents: 35,
    ),
    Student(
      id: 's2',
      firstName: 'Ibrahim',
      lastName: 'Diallo',
      className: '6ème B',
      level: 'Primaire',
      photo: '',
      averageGrade: 16.2,
      rank: 1,
      totalStudents: 30,
    ),
  ];

  Map<String, List<Subject>> _subjectsByStudent = {
    's1': [
      Subject(
        id: 'sub1',
        name: 'Mathématiques',
        teacher: 'M. Traoré',
        average: 15,
        coefficient: 4,
        grades: [
          Grade(id: 'g1', label: 'Contrôle 1', value: 14, outOf: 20, date: DateTime(2026, 1, 15), type: 'controle'),
          Grade(id: 'g2', label: 'Examen mi-semestre', value: 16, outOf: 20, date: DateTime(2026, 2, 1), type: 'examen'),
        ],
      ),
      Subject(
        id: 'sub2',
        name: 'Français',
        teacher: 'Mme Konaté',
        average: 13,
        coefficient: 3,
        grades: [
          Grade(id: 'g3', label: 'Dictée', value: 12, outOf: 20, date: DateTime(2026, 1, 20), type: 'controle'),
        ],
      ),
    ],
    's2': [
      Subject(
        id: 'sub3',
        name: 'Mathématiques',
        teacher: 'Mme Sylla',
        average: 17,
        coefficient: 3,
        grades: [
          Grade(id: 'g4', label: 'Contrôle 1', value: 18, outOf: 20, date: DateTime(2026, 1, 12), type: 'controle'),
        ],
      ),
    ],
  };

  Map<String, List<ScheduleSlot>> _scheduleByStudent = {
    's1': [
      ScheduleSlot(
        id: 'sc1',
        day: 0,
        startTime: '08:00',
        endTime: '09:00',
        subject: 'Mathématiques',
        teacher: 'M. Traoré',
        room: 'Salle 101',
      ),
      ScheduleSlot(
        id: 'sc2',
        day: 0,
        startTime: '09:00',
        endTime: '10:00',
        subject: 'Français',
        teacher: 'Mme Konaté',
        room: 'Salle 102',
      ),
    ],
    's2': [
      ScheduleSlot(
        id: 'sc3',
        day: 0,
        startTime: '08:00',
        endTime: '09:00',
        subject: 'Mathématiques',
        teacher: 'Mme Sylla',
        room: 'Salle 201',
      ),
    ],
  };

  Map<String, List<Payment>> _paymentsByStudent = {
    's1': [
      Payment(
        id: 'p1',
        label: "Frais d'inscription",
        amount: 150000,
        paidAmount: 150000,
        dueDate: DateTime(2025, 9, 1),
        status: 'paid',
        type: 'inscription',
      ),
      Payment(
        id: 'p2',
        label: 'Mensualité Janvier',
        amount: 50000,
        paidAmount: 0,
        dueDate: DateTime(2026, 1, 5),
        status: 'unpaid',
        type: 'mensualite',
      ),
    ],
    's2': [
      Payment(
        id: 'p3',
        label: "Frais d'inscription",
        amount: 120000,
        paidAmount: 120000,
        dueDate: DateTime(2025, 9, 1),
        status: 'paid',
        type: 'inscription',
      ),
    ],
  };

  List<NotificationModel> _notifications = [
    NotificationModel(
      id: 'n1',
      title: 'Nouvelles notes publiées',
      message: 'Les notes de Mathématiques du contrôle 1 sont disponibles.',
      date: DateTime(2026, 2, 10),
      read: false,
      type: 'grade',
    ),
    NotificationModel(
      id: 'n2',
      title: 'Absence non justifiée',
      message: 'Amina a une absence non justifiée le 24/01/2026.',
      date: DateTime(2026, 2, 8),
      read: false,
      type: 'absence',
    ),
  ];

  List<Student> get students => _students;
  List<Subject> getSubjectsForStudent(String studentId) => _subjectsByStudent[studentId] ?? [];
  List<ScheduleSlot> getScheduleForStudent(String studentId) => _scheduleByStudent[studentId] ?? [];
  List<Payment> getPaymentsForStudent(String studentId) => _paymentsByStudent[studentId] ?? [];
  List<NotificationModel> get notifications => _notifications;

  Student? getStudentById(String id) => _students.firstWhereOrNull((student) => student.id == id);
  int getUnreadNotificationsCount() => _notifications.where((n) => !n.read).length;

  Future<void> syncWithBackend(String accessToken) async {
    if (accessToken.isEmpty) return;

    try {
      final payload = await BackendApi.mobileBootstrap(accessToken);

      final backendStudents = (payload['students'] as List<dynamic>? ?? [])
          .map((e) => Student.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();

      final backendSubjectsByStudent = <String, List<Subject>>{};
      final rawSubjectsByStudent = Map<String, dynamic>.from(payload['subjectsByStudent'] as Map? ?? {});
      rawSubjectsByStudent.forEach((key, value) {
        final items = (value as List<dynamic>)
            .map((e) => Subject.fromJson(Map<String, dynamic>.from(e as Map)))
            .toList();
        backendSubjectsByStudent[key] = items;
      });

      final backendScheduleByStudent = <String, List<ScheduleSlot>>{};
      final rawScheduleByStudent = Map<String, dynamic>.from(payload['scheduleByStudent'] as Map? ?? {});
      rawScheduleByStudent.forEach((key, value) {
        final items = (value as List<dynamic>)
            .map((e) => ScheduleSlot.fromJson(Map<String, dynamic>.from(e as Map)))
            .toList();
        backendScheduleByStudent[key] = items;
      });

      final backendPaymentsByStudent = <String, List<Payment>>{};
      final rawPaymentsByStudent = Map<String, dynamic>.from(payload['paymentsByStudent'] as Map? ?? {});
      rawPaymentsByStudent.forEach((key, value) {
        final items = (value as List<dynamic>)
            .map((e) => Payment.fromJson(Map<String, dynamic>.from(e as Map)))
            .toList();
        backendPaymentsByStudent[key] = items;
      });

      final backendNotifications = (payload['notifications'] as List<dynamic>? ?? [])
          .map((e) => NotificationModel.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();

      if (backendStudents.isNotEmpty) _students = backendStudents;
      if (backendSubjectsByStudent.isNotEmpty) _subjectsByStudent = backendSubjectsByStudent;
      if (backendScheduleByStudent.isNotEmpty) _scheduleByStudent = backendScheduleByStudent;
      if (backendPaymentsByStudent.isNotEmpty) _paymentsByStudent = backendPaymentsByStudent;
      _notifications = backendNotifications;

      notifyListeners();
    } catch (_) {
      // Keep local fallback mock data when backend is not reachable.
    }
  }

  Future<void> markNotificationAsRead(String notificationId, {String? accessToken}) async {
    final index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index == -1) return;

    _notifications[index] = _notifications[index].copyWith(read: true);
    notifyListeners();

    if (accessToken != null && accessToken.isNotEmpty) {
      try {
        await BackendApi.markNotificationAsRead(
          accessToken: accessToken,
          notificationId: notificationId,
        );
      } catch (_) {
        // Keep optimistic UI state
      }
    }
  }

  double calculateOverallAverage(String studentId) {
    final subjects = getSubjectsForStudent(studentId);
    if (subjects.isEmpty) return 0;

    double total = 0;
    int totalCoefficients = 0;

    for (final subject in subjects) {
      total += subject.average * subject.coefficient;
      totalCoefficients += subject.coefficient;
    }

    return totalCoefficients > 0 ? total / totalCoefficients : 0;
  }
}

extension ListExtensions<T> on List<T> {
  T? firstWhereOrNull(bool Function(T) test) {
    for (final element in this) {
      if (test(element)) return element;
    }
    return null;
  }
}
