# Smart Family Connect - Flutter Version

## 🚀 Overview

This is the Flutter implementation of the Smart Family Connect application, a school management mobile application for parents and students.

## 📱 Features Implemented

### ✅ Completed Features
- **Authentication System**: Role-based login (Parent/Student)
- **State Management**: Provider pattern for reactive UI
- **Navigation**: go_router for clean routing
- **Theming**: Custom theme system with light/dark mode
- **Data Models**: Complete data structures for students, grades, schedules, payments
- **UI Components**: Custom reusable widgets
- **Main Screens**: 
  - Login screen with role selection
  - Parent dashboard with child selector
  - Placeholder screens for all routes

### 🔄 Features to Implement
- Grades viewing and management
- Schedule display
- Payment tracking
- Notifications system
- Student portal screens

## 🛠️ Tech Stack

- **Framework**: Flutter 3.x
- **Language**: Dart
- **State Management**: Provider
- **Navigation**: go_router
- **UI Components**: Material Design 3
- **Icons**: Iconsax
- **Charts**: fl_chart (for future implementation)

## 📁 Project Structure

```
lib/
├── main.dart                 # Entry point
├── models/                   # Data models
│   ├── student.dart
│   ├── subject.dart
│   ├── grade.dart
│   ├── schedule_slot.dart
│   ├── payment.dart
│   └── notification.dart
├── providers/               # State management
│   ├── auth_provider.dart
│   └── data_provider.dart
├── screens/                 # UI Screens
│   ├── login_screen.dart
│   ├── parent/
│   │   └── parent_dashboard_screen.dart
│   └── student/
│       └── student_dashboard_screen.dart
├── widgets/                 # Reusable components
│   ├── custom_widgets.dart
│   └── navigation_widgets.dart
├── router/                  # Navigation
│   └── app_router.dart
└── theme/                   # Theming
    └── app_theme.dart
```

## 🚀 Getting Started

### Prerequisites
- Flutter SDK 3.0 or higher
- Dart SDK
- Android Studio / VS Code with Flutter extensions

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd smart-family-connect-flutter
```

2. **Install dependencies**
```bash
flutter pub get
```

3. **Run the application**
```bash
# For development
flutter run

# For specific device
flutter run -d <device-id>
```

## 🔧 Development Commands

```bash
# Analyze code
flutter analyze

# Run tests
flutter test

# Build APK
flutter build apk

# Build iOS
flutter build ios
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0066CC)
- **Success**: Green (#28A745)
- **Warning**: Yellow (#FFC107)
- **Error**: Red (#DC3545)
- **Info**: Teal (#17A2B8)

### Typography
- **Headings**: Inter font family
- **Body**: Material Design defaults
- **Weights**: Regular, SemiBold, Bold

### Components
- **Buttons**: Rounded with elevation
- **Cards**: Soft shadows with rounded corners
- **Inputs**: Filled style with subtle borders

## 🔐 Authentication Flow

1. User selects role (Parent/Student)
2. Enters credentials (demo mode - any values work)
3. Redirected to respective dashboard
4. Session management via Provider

## 📊 Data Structure

The app uses mock data structured as:
- Students with academic information
- Subjects with grades and coefficients
- Schedules with weekly planning
- Payments with status tracking
- Notifications for updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues or questions:
- Check existing GitHub issues
- Create new issue with detailed description
- Include screenshots/logs when applicable

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is a demonstration application using mock data. For production use, integrate with real backend APIs and implement proper security measures.