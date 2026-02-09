import 'package:flutter/material.dart';
import '../models/user.dart';
import '../parent/parent_dashboard.dart';
import '../student/student_dashboard.dart';

class RoleRouter {
  static Widget getHome(User user) {
    switch (user.role) {
      case UserRole.parent:
        return const ParentDashboard();
      case UserRole.student:
        return const StudentDashboard();
    }
  }
}
