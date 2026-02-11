import 'package:flutter/material.dart';
import 'login_page.dart';
import 'dart:ui';


class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key});

  void _goToLogin(BuildContext context) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE3F2FD),
      body: Stack(
        children: [
          /// 🔹 IMAGE BACKGROUND
          Positioned.fill(
            child: Image.asset(
              'assets/images/classe.jpeg',
              fit: BoxFit.cover,
            ),
          ),

          /// 🔹 BLUR EFFECT
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 3, sigmaY: 3),
              child: Container(
                color: Colors.transparent,
              ),
            ),
          ),

          /// 🔹 BLUE OVERLAY
          Positioned.fill(
            child: Container(
              color: const Color(0xFFFFFFFF).withOpacity(0.18),
            ),
          ),

          /// 🔹 WELCOME CARD
          Center(
            child: Card(
              color: const Color(0xFFFFF6E5), // beige clair
              elevation: 6,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              child: Padding(
                padding: const EdgeInsets.all(28),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      "Welcome to EduFaso!",
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFF2B14A),
                        fontFamily: 'Poppins',
                      ),
                    ),

                    const SizedBox(height: 16),

                    Container(
                      height: 3,
                      width: 80,
                      decoration: BoxDecoration(
                        color: Color(0xFFF2B14A),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),

                    const SizedBox(height: 20),

                    Text(
                      "EduFaso helps schools manage students, parents, "
                          "academics and payments in one smart platform.\n\n"
                          "Simple. Secure. Real-time.",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.grey[800],
                        height: 1.4,
                        fontFamily: 'Poppins',
                      ),
                    ),

                    const SizedBox(height: 30),

                    SizedBox(
                      width: 155,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () => _goToLogin(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF2B14A),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          elevation: 2,
                        ),
                        child: const Text(
                          "START NOW",
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}