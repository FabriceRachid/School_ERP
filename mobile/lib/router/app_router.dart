import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import '../screens/login_screen.dart';
import '../screens/parent/parent_dashboard_screen.dart';
import '../screens/student/student_dashboard_screen.dart';
import '../screens/parent/parent_grades_screen.dart';
import '../screens/parent/parent_schedule_screen.dart';
import '../screens/parent/parent_payments_screen.dart';
import '../screens/parent/parent_more_screen.dart';
import '../screens/student/student_grades_screen.dart';
import '../screens/student/student_schedule_screen.dart';
import '../screens/student/student_more_screen.dart';
import '../providers/auth_provider.dart';
import 'package:provider/provider.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    routes: [
      GoRoute(
        path: '/',
        redirect: (_, __) => '/login',
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      
      // Parent routes
      ShellRoute(
        builder: (context, state, child) {
          final authProvider = Provider.of<AuthProvider>(context);
          if (!authProvider.isAuthenticated || authProvider.role != UserRole.parent) {
            return const LoginScreen();
          }
          return child;
        },
        routes: [
          GoRoute(
            path: '/parent',
            builder: (context, state) => const ParentDashboardScreen(),
          ),
          GoRoute(
            path: '/parent/grades',
            builder: (context, state) => const ParentGradesScreen(),
          ),
          GoRoute(
            path: '/parent/schedule',
            builder: (context, state) => const ParentScheduleScreen(),
          ),
          GoRoute(
            path: '/parent/payments',
            builder: (context, state) => const ParentPaymentsScreen(),
          ),
          GoRoute(
            path: '/parent/more',
            builder: (context, state) => const ParentMoreScreen(),
          ),
        ],
      ),
      
      // Student routes
      ShellRoute(
        builder: (context, state, child) {
          final authProvider = Provider.of<AuthProvider>(context);
          if (!authProvider.isAuthenticated || authProvider.role != UserRole.student) {
            return const LoginScreen();
          }
          return child;
        },
        routes: [
          GoRoute(
            path: '/student',
            builder: (context, state) => const StudentDashboardScreen(),
          ),
          GoRoute(
            path: '/student/grades',
            builder: (context, state) => const StudentGradesScreen(),
          ),
          GoRoute(
            path: '/student/schedule',
            builder: (context, state) => const StudentScheduleScreen(),
          ),
          GoRoute(
            path: '/student/more',
            builder: (context, state) => const StudentMoreScreen(),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(title: const Text('Page non trouvée')),
      body: const Center(
        child: Text('Cette page n\'existe pas'),
      ),
    ),
  );
}