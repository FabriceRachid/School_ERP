class Validators {
  static String? requiredField(String? value) {
    if (value == null || value.trim().isEmpty) {
      return "This field is required";
    }
    return null;
  }

  static String? gmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return "This field is required";
    }
    if (!value.endsWith("@gmail.com")) {
      return "Invalid email (e.g., name@gmail.com)";
    }
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return "This field is required";
    }
    if (value.length < 8) {
      return "At least 8 characters";
    }
    return null;
  }

  static String? strongPassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'This field is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    // Regex for strong password: 1 uppercase, 1 lowercase, 1 digit, 1 special character
    String pattern = r'''^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};'\":\\|,.<>/?]).{8,}$''';
    RegExp regExp = RegExp(pattern);
    if (!regExp.hasMatch(value)) {
      return 'Must contain uppercase, lowercase, digit, and symbol.';
    }
    return null;
  }

  static String? confirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return "This field is required";
    }
    if (value != password) {
      return "Passwords do not match";
    }
    return null;
  }
}
