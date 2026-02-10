import 'package:flutter/material.dart';
import '../auth/auth_service.dart';
import '../core/role_router.dart';
import '../models/user.dart';
import '../core/validators.dart';
import '../services/api_service.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  final _phoneController = TextEditingController();
  final _parentNameController = TextEditingController();
  final _parentPhoneController = TextEditingController();

  bool obscurePassword = true;
  bool obscureConfirm = true;
  UserRole selectedRole = UserRole.student;

  void _openRoleSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),

            _roleOption(
              title: "Parent",
              icon: Icons.family_restroom,
              role: UserRole.parent,
            ),
            _roleOption(
              title: "Student",
              icon: Icons.school,
              role: UserRole.student,
            ),
            const SizedBox(height: 12),
          ],
        );
      },
    );
  }

  Widget _roleOption({
    required String title,
    required IconData icon,
    required UserRole role,
  }) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFFF2B14A)),
      title: Text(title),
      onTap: () {
        setState(() => selectedRole = role);
        Navigator.pop(context);
      },
    );
  }

  String _roleLabel(UserRole role) {
    switch (role) {
      case UserRole.admin:
        return "Administrateur";
      case UserRole.teacher:
        return "Enseignant";
      case UserRole.parent:
        return "Parent";
      case UserRole.student:
        return "Étudiant";
    }
  }

  void _signUp() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      // Split the name into first and last name
      final fullName = _nameController.text.trim();
      final nameParts = fullName.split(' ');
      final firstName = nameParts.isNotEmpty ? nameParts[0] : '';
      final lastName = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '';

      // Validate that we have both first and last name
      if (firstName.isEmpty || lastName.isEmpty) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Veuillez entrer un nom complet (prénom et nom)'),
              backgroundColor: Colors.red,
            ),
          );
        }
        return;
      }

      // Show loading indicator
      if (mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return const AlertDialog(
              content: Row(
                children: [
                  CircularProgressIndicator(),
                  SizedBox(width: 20),
                  Text("Création du compte..."),
                ],
              ),
            );
          },
        );
      }

      // Handle different roles differently
      if (selectedRole == UserRole.student || selectedRole == UserRole.parent) {
        // Students and parents self-register with additional information
        final registrationData = {
          'school_id': '00000000-0000-0000-0000-000000000001', // Default school
          'first_name': firstName,
          'last_name': lastName,
          'email': _emailController.text.trim(),
          'password': _passwordController.text.trim(),
          'phone': _phoneController.text.trim(),
          'parent_name': _parentNameController.text.trim(),
          'parent_phone': _parentPhoneController.text.trim(),
        };

        final result = await ApiService.registerStudent(registrationData);
        
        // Close loading dialog
        if (mounted) {
          Navigator.pop(context);
          
          if (result['success']) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Inscription réussie! Veuillez vous connecter.'),
                backgroundColor: Colors.green,
              ),
            );
            Navigator.pushReplacementNamed(context, '/login');
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(result['message'] ?? 'Erreur d\'inscription'),
                backgroundColor: Colors.red,
              ),
            );
          }
        }
        return;
      }

      // For teachers and admins, use traditional signup
      final schoolId = '00000000-0000-0000-0000-000000000001';

      final user = await AuthService.signUp(
        firstName: firstName,
        lastName: lastName,
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
        role: selectedRole.toString().split('.').last,
        schoolId: schoolId,
      );

      // Close loading dialog
      if (mounted) {
        Navigator.pop(context);
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => RoleRouter.getHome(user),
          ),
        );
      }
    } catch (error) {
      // Close loading dialog if open
      if (mounted) {
        Navigator.pop(context);
        
        // Show specific error message
        String errorMessage = error.toString();
        if (errorMessage.contains('school not found')) {
          errorMessage = 'École non trouvée. Veuillez contacter l\'administrateur.';
        } else if (errorMessage.contains('Missing required fields')) {
          errorMessage = 'Données manquantes. Veuillez vérifier le formulaire.';
        } else if (errorMessage.contains('Email already registered')) {
          errorMessage = 'Cet email est déjà utilisé.';
        } else if (errorMessage.contains('Password validation failed')) {
          errorMessage = 'Le mot de passe ne respecte pas les règles de sécurité.';
        }
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMessage),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  // Get or create a default school for testing
  Future<String> _getDefaultSchoolId() async {
    // For testing purposes, use a static default school ID
    // In production, this should be replaced with proper school selection from a list
    // The school should be pre-created in the database
    return '00000000-0000-0000-0000-000000000001';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F6F6),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // 🔹 IMAGE (like Login)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  bottom: Radius.circular(30),
                ),
                child: Image.asset(
                  'assets/images/log.jpeg',
                  height: 260,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),

              const SizedBox(height: 24),

              // 🔹 CARD
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 20,
                        offset: Offset(0, 10),
                      )
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Create your account",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 24),

                        _input(
                          controller: _nameController,
                          label: "Full name",
                          icon: Icons.person_outline,
                          validator: Validators.requiredField,
                        ),
                        const SizedBox(height: 14),

                        _input(
                          controller: _emailController,
                          label: "Email",
                          icon: Icons.email_outlined,
                          validator: Validators.gmail,
                        ),
                        const SizedBox(height: 14),

                        _passwordField(
                          controller: _passwordController,
                          label: "Password",
                          obscure: obscurePassword,
                          toggle: () {
                            setState(() => obscurePassword = !obscurePassword);
                          },
                          validator: Validators.strongPassword,
                        ),
                        const SizedBox(height: 14),

                        _passwordField(
                          controller: _confirmController,
                          label: "Confirm password",
                          obscure: obscureConfirm,
                          toggle: () {
                            setState(() => obscureConfirm = !obscureConfirm);
                          },
                          validator: (value) =>
                              Validators.confirmPassword(value, _passwordController.text),
                        ),

                        const SizedBox(height: 24),

                        // 🔹 ROLE SELECTOR
                        GestureDetector(
                          onTap: _openRoleSelector,
                          child: Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF6F6F6),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.person_outline, color: Colors.grey),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    _roleLabel(selectedRole),
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                ),
                                const Icon(Icons.keyboard_arrow_down),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 30),

                        // 🔹 BUTTON
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: _signUp,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF039BE5),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            child: const Text(
                              "Create Account",
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 16),

                        // 🔹 BACK TO LOGIN
                        Center(
                          child: GestureDetector(
                            onTap: () {
                              Navigator.pop(context);
                            },
                            child: Text.rich(
                              TextSpan(
                                text: "Already have an account? ",
                                style: TextStyle(color: Colors.grey[600]),
                                children: const [
                                  TextSpan(
                                    text: "Login",
                                    style: TextStyle(
                                      color: Color(0xFF039BE5),
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  // 🔹 INPUT
  Widget _input({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        filled: true,
        fillColor: const Color(0xFFF6F6F6),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  // 🔹 PASSWORD
  Widget _passwordField({
    required TextEditingController controller,
    required String label,
    required bool obscure,
    required VoidCallback toggle,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: const Icon(Icons.lock_outline),
        suffixIcon: IconButton(
          icon: Icon(obscure ? Icons.visibility_off : Icons.visibility),
          onPressed: toggle,
        ),
        filled: true,
        fillColor: const Color(0xFFF6F6F6),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  // 🔹 ROLE TILE
  Widget _roleTile({
    required String title,
    required IconData icon,
    required UserRole role,
  }) {
    final isSelected = selectedRole == role;

    return GestureDetector(
      onTap: () => setState(() => selectedRole = role),
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFFFF3E0) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected
                ? const Color(0xFFF2B14A)
                : Colors.grey.shade300,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color:
              isSelected ? const Color(0xFFF2B14A) : Colors.grey,
            ),
            const SizedBox(width: 12),
            Text(
              title,
              style: TextStyle(
                fontWeight:
                isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    _phoneController.dispose();
    _parentNameController.dispose();
    _parentPhoneController.dispose();
    super.dispose();
  }
}
