import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async' show TimeoutException;

class ApiService {
  // Configuration - Use localhost for web development
  static const String baseUrl = 'http://localhost:3001/api';

  // Headers avec token
  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }

  // Gestion des erreurs
  static String _handleError(dynamic error) {
    if (error.toString().contains('SocketException')) {
      return '❌ Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else if (error.toString().contains('TimeoutException')) {
      return '⏰ La requête a expiré. Veuillez réessayer.';
    } else if (error.toString().contains('FormatException')) {
      return '📄 Format de réponse invalide.';
    } else {
      return '❌ Une erreur inattendue est survenue: ${error.toString()}';
    }
  }

  // Méthode générique pour les requêtes GET
  static Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      print('🔄 GET $endpoint');
      final url = Uri.parse('$baseUrl$endpoint');
      final headers = await _getHeaders();
      
      final response = await http.get(url, headers: headers).timeout(
        Duration(seconds: 10),
      );
      
      print('📥 Status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('✅ Données chargées');
        return data;
      } else if (response.statusCode == 401) {
        // Token expiré
        await _clearAuthData();
        throw Exception('Session expirée. Veuillez vous reconnecter.');
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['message'] ?? 'Erreur du serveur');
      }
    } catch (error) {
      print('❌ Erreur GET: $error');
      throw Exception(_handleError(error));
    }
  }

  // Méthode générique pour les requêtes POST
  static Future<Map<String, dynamic>> post(
    String endpoint, 
    Map<String, dynamic> data
  ) async {
    try {
      print('🔄 POST $endpoint');
      final url = Uri.parse('$baseUrl$endpoint');
      final headers = await _getHeaders();
      
      // Ensure proper JSON encoding
      final jsonString = json.encode(data);
      print('📤 Données JSON: $jsonString');
      
      final response = await http.post(
        url,
        headers: headers,
        body: jsonString,
      ).timeout(Duration(seconds: 15));
      
      print('📥 Status: ${response.statusCode}');
      print('📥 Body: ${response.body}');
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);
        print('✅ Requête réussie');
        return responseData;
      } else if (response.statusCode == 401) {
        await _clearAuthData();
        throw Exception('Session expirée. Veuillez vous reconnecter.');
      } else {
        final errorData = json.decode(response.body);
        print('❌ Erreur: ${errorData['message']}');
        throw Exception(errorData['message'] ?? 'Erreur du serveur');
      }
    } catch (error) {
      print('❌ Erreur POST: $error');
      throw Exception(_handleError(error));
    }
  }

  // Méthode générique pour les requêtes PUT
  static Future<Map<String, dynamic>> put(
    String endpoint, 
    Map<String, dynamic> data
  ) async {
    try {
      print('🔄 PUT $endpoint');
      final url = Uri.parse('$baseUrl$endpoint');
      final headers = await _getHeaders();
      
      final response = await http.put(
        url,
        headers: headers,
        body: json.encode(data),
      ).timeout(Duration(seconds: 15));
      
      print('📥 Status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        print('✅ Mise à jour réussie');
        return responseData;
      } else if (response.statusCode == 401) {
        await _clearAuthData();
        throw Exception('Session expirée. Veuillez vous reconnecter.');
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['message'] ?? 'Erreur du serveur');
      }
    } catch (error) {
      print('❌ Erreur PUT: $error');
      throw Exception(_handleError(error));
    }
  }

  // Méthode générique pour les requêtes DELETE
  static Future<Map<String, dynamic>> delete(String endpoint) async {
    try {
      print('🔄 DELETE $endpoint');
      final url = Uri.parse('$baseUrl$endpoint');
      final headers = await _getHeaders();
      
      final response = await http.delete(
        url,
        headers: headers,
      ).timeout(Duration(seconds: 10));
      
      print('📥 Status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        print('✅ Suppression réussie');
        return responseData;
      } else if (response.statusCode == 401) {
        await _clearAuthData();
        throw Exception('Session expirée. Veuillez vous reconnecter.');
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['message'] ?? 'Erreur du serveur');
      }
    } catch (error) {
      print('❌ Erreur DELETE: $error');
      throw Exception(_handleError(error));
    }
  }

  // Authentification
  static Future<Map<String, dynamic>> login(
    String email, 
    String password
  ) async {
    try {
      print('🔄 Tentative de connexion...');
      final data = {
        'email': email,
        'password': password,
      };
      
      final response = await post('/auth/login', data);
      
      if (response['success'] == true && response['data'] != null) {
        // Stocker les tokens et les données utilisateur
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', response['data']['accessToken']);
        await prefs.setString('refreshToken', response['data']['refreshToken']);
        await prefs.setString('user', json.encode(response['data']['user']));
        
        print('✅ Connexion réussie');
        return {
          'success': true,
          'message': 'Connexion réussie',
          'user': response['data']['user']
        };
      } else {
        throw Exception(response['message'] ?? 'Erreur de connexion');
      }
    } catch (error) {
      print('❌ Erreur de connexion: $error');
      rethrow;
    }
  }

  static Future<void> logout() async {
    print('👋 Déconnexion...');
    await _clearAuthData();
    print('✅ Déconnexion réussie');
  }

  static Future<void> _clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('refreshToken');
    await prefs.remove('user');
  }

  // Récupérer l'utilisateur courant
  static Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString('user');
    if (userString != null) {
      return json.decode(userString);
    }
    return null;
  }

  // Vérifier si l'utilisateur est authentifié
  static Future<bool> isAuthenticated() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    return token != null && token.isNotEmpty;
  }

  // Rafraîchir le token
  static Future<String?> refreshToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final refreshToken = prefs.getString('refreshToken');
      
      if (refreshToken == null || refreshToken.isEmpty) {
        return null;
      }
      
      final data = {'refreshToken': refreshToken};
      final response = await post('/auth/refresh-token', data);
      
      if (response['success'] == true && response['data'] != null) {
        final newToken = response['data']['accessToken'];
        await prefs.setString('token', newToken);
        return newToken;
      }
    } catch (error) {
      print('❌ Impossible de rafraîchir le token: $error');
      await logout();
    }
    return null;
  }

  // Test de connexion
  static Future<bool> testConnection() async {
    try {
      final response = await get('/auth/profile');
      return response['success'] == true;
    } catch (error) {
      print('❌ Test de connexion échoué: $error');
      return false;
    }
  }

  // Student self-registration
  static Future<Map<String, dynamic>> registerStudent(Map<String, dynamic> data) async {
    try {
      print('🔄 Student registration...');
      final url = Uri.parse('$baseUrl/students/register');
      
      final jsonString = json.encode(data);
      print('📤 Registration data: $jsonString');
      
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonString,
      ).timeout(Duration(seconds: 15));
      
      print('📥 Status: ${response.statusCode}');
      print('📥 Body: ${response.body}');
      
      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        print('✅ Student registration successful');
        return {
          'success': true,
          'data': responseData['data'],
          'message': responseData['message']
        };
      } else {
        final errorData = json.decode(response.body);
        print('❌ Registration error: ${errorData['message']}');
        return {
          'success': false,
          'message': errorData['message'] ?? 'Registration failed'
        };
      }
    } catch (error) {
      print('❌ Registration error: $error');
      return {
        'success': false,
        'message': error.toString()
      };
    }
  }
}