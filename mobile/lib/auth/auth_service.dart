import '../models/user.dart';

class AuthService {
  static User login(String email, String password) {
    if (email.contains("parent")) {
      return User(
        id: "2",
        name: "Parent",
        email: email,
        role: UserRole.parent,
      );
    }

    return User(
      id: "3",
      name: "Élève",
      email: email,
      role: UserRole.student,
    );
  }

  static User signUp({
    required String name,
    required String email,
    required String password,
    required UserRole role,
  }) {
    return User(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      email: email,
      role: role,
    );
  }
}