import 'dart:convert';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthService {
  // Login avec backend réel
  static Future<User> login(String email, String password) async {
    try {
      print('🔄 Authentification en cours...');
      
      final result = await ApiService.login(email, password);
      
      if (result['success'] == true) {
        final userData = result['user'];
        print('✅ Authentification réussie');
        
        return User(
          id: userData['id'],
          name: '${userData['first_name']} ${userData['last_name']}',
          email: userData['email'],
          role: _mapRole(userData['role']),
        );
      } else {
        throw Exception(result['message'] ?? 'Échec de l\'authentification');
      }
    } catch (error) {
      print('❌ Erreur d\'authentification: $error');
      rethrow;
    }
  }

  // Inscription avec backend réel
  static Future<User> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String role,
    required String schoolId,
    String? phone,
    String? address,
    String? dateOfBirth,
  }) async {
    try {
      print('🔄 Inscription en cours...');
      
      final data = {
        'school_id': schoolId,
        'first_name': firstName,
        'last_name': lastName,
        'email': email,
        'password': password,
        'role': role,
        if (phone != null) 'phone': phone,
        if (address != null) 'address': address,
        if (dateOfBirth != null) 'date_of_birth': dateOfBirth,
      };
      
      print('📤 Données envoyées: ${data.toString()}');
      
      final response = await ApiService.post('/auth/register', data);
      
      print('📥 Réponse reçue: ${response.toString()}');
      
      if (response['success'] == true) {
        final userData = response['data'];
        print('✅ Inscription réussie');
        
        return User(
          id: userData['id'],
          name: '${userData['first_name']} ${userData['last_name']}',
          email: userData['email'],
          role: _mapRole(userData['role']),
        );
      } else {
        print('❌ Erreur d\'inscription: ${response['message']}');
        throw Exception(response['message'] ?? 'Échec de l\'inscription');
      }
    } catch (error) {
      print('❌ Erreur d\'inscription: $error');
      rethrow;
    }
  }

  // Mapping des rôles backend -> frontend
  static UserRole _mapRole(String backendRole) {
    switch (backendRole.toLowerCase()) {
      case 'admin':
        return UserRole.admin;
      case 'teacher':
        return UserRole.teacher;
      case 'student':
        return UserRole.student;
      case 'parent':
        return UserRole.parent;
      default:
        return UserRole.student;
    }
  }

  // Déconnexion
  static Future<void> logout() async {
    try {
      await ApiService.logout();
      print('✅ Déconnexion réussie');
    } catch (error) {
      print('❌ Erreur lors de la déconnexion: $error');
      rethrow;
    }
  }

  // Vérifier l'état d'authentification
  static Future<bool> isAuthenticated() async {
    return await ApiService.isAuthenticated();
  }

  // Récupérer l'utilisateur courant
  static Future<User?> getCurrentUser() async {
    try {
      final userData = await ApiService.getCurrentUser();
      if (userData != null) {
        return User(
          id: userData['id'],
          name: '${userData['first_name']} ${userData['last_name']}',
          email: userData['email'],
          role: _mapRole(userData['role']),
        );
      }
      return null;
    } catch (error) {
      print('❌ Erreur lors de la récupération de l\'utilisateur: $error');
      return null;
    }
  }

  // Rafraîchir le token
  static Future<String?> refreshToken() async {
    return await ApiService.refreshToken();
  }

  // Test de connexion
  static Future<bool> testConnection() async {
    return await ApiService.testConnection();
  }
}