import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/backend_api.dart';

enum UserRole { parent, student }

class AuthProvider extends ChangeNotifier {
  static const _tokenKey = 'mobile_access_token';
  static const _refreshTokenKey = 'mobile_refresh_token';
  static const _roleKey = 'mobile_role';
  static const _userNameKey = 'mobile_user_name';

  bool _isAuthenticated = false;
  UserRole? _role;
  String _userName = '';
  String _accessToken = '';
  String _refreshToken = '';
  bool _initialized = false;
  String _lastError = '';

  bool get isAuthenticated => _isAuthenticated;
  UserRole? get role => _role;
  String get userName => _userName;
  String get accessToken => _accessToken;
  bool get initialized => _initialized;
  String get lastError => _lastError;

  AuthProvider() {
    _restoreSession();
  }

  UserRole? _roleFromApi(String? role) {
    if (role == 'parent') return UserRole.parent;
    if (role == 'student') return UserRole.student;
    return null;
  }

  Future<bool> login(String email, String password, UserRole selectedRole) async {
    try {
      _lastError = '';
      final data = await BackendApi.login(email: email, password: password);
      final user = data['user'] as Map<String, dynamic>;
      final apiRole = _roleFromApi(user['role'] as String?);

      if (apiRole == null) {
        _lastError = 'Ce compte n\'est pas un compte mobile Parent/Élève.';
        return false;
      }

      if (apiRole != selectedRole) {
        _lastError = apiRole == UserRole.parent
            ? 'Ce compte est un compte Parent. Sélectionnez Parent.'
            : 'Ce compte est un compte Élève. Sélectionnez Élève.';
        return false;
      }

      final prefs = await SharedPreferences.getInstance();

      _isAuthenticated = true;
      _role = apiRole;
      _userName = (user['name'] as String?) ?? '';
      _accessToken = (data['accessToken'] as String?) ?? '';
      _refreshToken = (data['refreshToken'] as String?) ?? '';

      await prefs.setString(_tokenKey, _accessToken);
      await prefs.setString(_refreshTokenKey, _refreshToken);
      await prefs.setString(_roleKey, _role!.name);
      await prefs.setString(_userNameKey, _userName);

      notifyListeners();
      return true;
    } catch (error) {
      _lastError = error.toString().replaceFirst('Exception: ', '');
      return false;
    }
  }

  Future<void> _restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey) ?? '';
    final roleName = prefs.getString(_roleKey);
    final userName = prefs.getString(_userNameKey) ?? '';

    if (token.isNotEmpty && roleName != null) {
      _isAuthenticated = true;
      _accessToken = token;
      _refreshToken = prefs.getString(_refreshTokenKey) ?? '';
      _role = roleName == UserRole.parent.name ? UserRole.parent : UserRole.student;
      _userName = userName;
    }

    _initialized = true;
    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_refreshTokenKey);
    await prefs.remove(_roleKey);
    await prefs.remove(_userNameKey);

    _isAuthenticated = false;
    _role = null;
    _userName = '';
    _accessToken = '';
    _refreshToken = '';
    _lastError = '';
    notifyListeners();
  }
}
