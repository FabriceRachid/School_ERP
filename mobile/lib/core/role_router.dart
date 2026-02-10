import 'package:flutter/material.dart';
import '../models/user.dart';
import '../parent/parent_dashboard.dart';
import '../student/student_dashboard.dart';

class RoleRouter {
  static Widget getHome(User user) {
    switch (user.role) {
      case UserRole.admin:
        return const Scaffold(
          body: Center(
            child: Text('Admin Dashboard - À implémenter'),
          ),
        );
      case UserRole.teacher:
        return const Scaffold(
          body: Center(
            child: Text('Teacher Dashboard - À implémenter'),
          ),
        );
      case UserRole.parent:
        return const ParentDashboard();
      case UserRole.student:
        return const StudentDashboard();
    }
  }
}
