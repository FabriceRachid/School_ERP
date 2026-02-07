# School_ERP
Multi-School Management System (Education ERP) — A full-stack platform for managing multiple schools from a single system. It handles students, teachers, grades, timetables, and fee payments, with role-based access, a REST API (Node.js + Express), a web interface (React), and a mobile app (Flutter).

## Project Structure

```
School_ERP/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── class.controller.js
│   │   ├── grade.controller.js
│   │   ├── notification.controller.js
│   │   ├── parent.controller.js
│   │   ├── payment.controller.js
│   │   ├── school.controller.js
│   │   ├── student.controller.js
│   │   ├── subject.controller.js
│   │   ├── teacher.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── role.middleware.js
│   ├── models/
│   │   ├── class.model.js
│   │   ├── fee.model.js
│   │   ├── grade.model.js
│   │   ├── index.js
│   │   ├── notification.model.js
│   │   ├── parent.model.js
│   │   ├── payment.model.js
│   │   ├── school.model.js
│   │   ├── student.model.js
│   │   ├── subject.model.js
│   │   ├── teacher.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── class.routes.js
│   │   ├── grade.routes.js
│   │   ├── notification.routes.js
│   │   ├── parent.routes.js
│   │   ├── payment.routes.js
│   │   ├── school.routes.js
│   │   ├── student.routes.js
│   │   ├── subject.routes.js
│   │   ├── teacher.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── payment.service.js
│   │   ├── report.service.js
│   │   └── student.service.js
│   ├── src/
│   │   ├── app.js
│   │   └── server.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── password.js
│   ├── .env
│   ├── db.js
│   ├── package.json
│   ├── swagger.yaml
│   ├── test-api.js
│   ├── test-auth.js
│   └── test-parent.js
├── frontend/                 # (To be created)
│   └── web/                 # React web application
└── mobile/                  # (To be created)
    └── flutter_app/         # Flutter mobile application
```

## Backend API Information

- **Base URL**: `http://localhost:3001/api`
- **API Documentation**: `http://localhost:3001/api-docs`
- **Health Check**: `http://localhost:3001/health`

## Connecting Frontend Applications

### 1. Web Frontend (React)

To connect a React web application to your backend:

1. **Create the frontend directory**:
```bash
mkdir frontend
cd frontend
npx create-react-app web
```

2. **Install HTTP client**:
```bash
npm install axios
```

3. **Create API service file** (`frontend/web/src/services/api.js`):
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

4. **Example usage in components**:
```javascript
import api from '../services/api';

// Login
const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get students
const getStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
```

### 2. Mobile Frontend (Flutter)

To connect a Flutter mobile application to your backend:

1. **Create Flutter project**:
```bash
flutter create mobile/flutter_app
cd mobile/flutter_app
```

2. **Add dependencies** in `pubspec.yaml`:
```yaml
dependencies:
  http: ^0.13.5
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^5.0.2
```

3. **Run**: `flutter pub get`

4. **Create API service** (`lib/services/api_service.dart`):
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String _baseUrl = 'http://localhost:3001/api';
  
  // For emulator use: http://10.0.2.2:3001/api (Android)
  // For physical device: Use your computer's IP address
  
  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    final headers = {
      'Content-Type': 'application/json',
    };
    
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }

  // Login
  static Future<Map<String, dynamic>> login(Map<String, dynamic> credentials) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(credentials),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      return data;
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }

  // Get students
  static Future<List<dynamic>> getStudents() async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$_baseUrl/students'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load students: ${response.body}');
    }
  }

  // Logout
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }
}
```

5. **Usage in Flutter widgets**:
```dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class StudentListScreen extends StatefulWidget {
  @override
  _StudentListScreenState createState() => _StudentListScreenState();
}

class _StudentListScreenState extends State<StudentListScreen> {
  List<dynamic> students = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  _loadStudents() async {
    try {
      final data = await ApiService.getStudents();
      setState(() {
        students = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Center(child: CircularProgressIndicator());
    }

    return ListView.builder(
      itemCount: students.length,
      itemBuilder: (context, index) {
        final student = students[index];
        return ListTile(
          title: Text(student['name']),
          subtitle: Text('ID: ${student['student_id']}'),
        );
      },
    );
  }
}
```

### 3. Important Configuration Notes

#### For Mobile Development:
- **Emulator**: Use `http://10.0.2.2:3001` (Android) or `http://localhost:3001` (iOS Simulator)
- **Physical Device**: Replace `localhost` with your computer's local IP address
- **Network Security**: Add network permissions in AndroidManifest.xml and Info.plist

#### For Production:
- Change API URLs to your production domain
- Enable HTTPS
- Add proper error handling and loading states
- Implement token refresh mechanisms

### 4. CORS Configuration

Your backend already has CORS enabled in `backend/src/app.js`:
```javascript
app.use(cors()); // Allows all origins
```

For production, you might want to restrict origins:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'yourdomain.com'],
  credentials: true
}));
```

### 5. Authentication Flow

1. User logs in via `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token (localStorage for web, SharedPreferences for mobile)
4. Token is sent in Authorization header for protected routes
5. Backend validates token using middleware