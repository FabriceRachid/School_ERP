import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class BackendApi {
  static String get _defaultBaseUrl {
    if (kIsWeb) return 'http://localhost:3001';

    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return 'http://10.0.2.2:3001';
      case TargetPlatform.iOS:
      case TargetPlatform.windows:
      case TargetPlatform.macOS:
      case TargetPlatform.linux:
      case TargetPlatform.fuchsia:
        return 'http://localhost:3001';
    }
  }

  static final String _baseUrl = (() {
    const configured = String.fromEnvironment('API_BASE_URL', defaultValue: '');
    return configured.isNotEmpty ? configured : _defaultBaseUrl;
  })();

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/api/frontend/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400 || payload['success'] == false) {
      throw Exception(payload['message'] ?? 'Login error');
    }

    return (payload['data'] as Map<String, dynamic>);
  }

  static Future<Map<String, dynamic>> mobileBootstrap(String accessToken) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/api/frontend/mobile/bootstrap'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400 || payload['success'] == false) {
      throw Exception(payload['message'] ?? 'Bootstrap error');
    }

    return (payload['data'] as Map<String, dynamic>);
  }

  static Future<void> markNotificationAsRead({
    required String accessToken,
    required String notificationId,
  }) async {
    final response = await http.put(
      Uri.parse('$_baseUrl/api/notifications/$notificationId/read'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400 || payload['success'] == false) {
      throw Exception(payload['message'] ?? 'Notification read error');
    }
  }

  static Future<void> markAllNotificationsAsRead({
    required String accessToken,
  }) async {
    final response = await http.put(
      Uri.parse('$_baseUrl/api/notifications/read-all'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400 || payload['success'] == false) {
      throw Exception(payload['message'] ?? 'Notification read-all error');
    }
  }
}
