import 'package:flutter/material.dart';
import 'auth/login_page.dart';
import 'auth/onboarding_page.dart';
import 'dashboard/dashboard_page.dart';

void main() {
  runApp(EduERPApp());
}
class EduERPApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EduERP',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'Poppins',
      ),
      home: OnboardingPage(),
      // routes: {
      //   '/dashboard': (context) => DashboardPage(),
      // },
      debugShowCheckedModeBanner: false,
    );
  }
}