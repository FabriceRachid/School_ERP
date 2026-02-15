import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';

class BottomNavBar extends StatefulWidget {
  final int currentIndex;
  final String role; // 'parent' or 'student'
  final Function(int)? onTap; // Optional callback for custom handling

  const BottomNavBar({
    super.key,
    required this.currentIndex,
    required this.role,
    this.onTap,
  });

  @override
  State<BottomNavBar> createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<BottomNavBar> {
  late List<Map<String, dynamic>> _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = widget.role == 'parent'
        ? [
            {
              'label': 'Accueil',
              'icon': Icons.home,
              'path': '/parent',
            },
            {
              'label': 'Notes',
              'icon': Icons.school,
              'path': '/parent/grades',
            },
            {
              'label': 'Emploi du temps',
              'icon': Icons.calendar_today,
              'path': '/parent/schedule',
            },
            {
              'label': 'Plus',
              'icon': Icons.more_horiz,
              'path': '/parent/more',
            },
          ]
        : [
            {
              'label': 'Accueil',
              'icon': Icons.home,
              'path': '/student',
            },
            {
              'label': 'Notes',
              'icon': Icons.school,
              'path': '/student/grades',
            },
            {
              'label': 'Emploi du temps',
              'icon': Icons.calendar_today,
              'path': '/student/schedule',
            },
            {
              'label': 'Plus',
              'icon': Icons.more_horiz,
              'path': '/student/more',
            },
          ];
  }

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: widget.currentIndex,
      onTap: (index) {
        if (widget.onTap != null) {
          widget.onTap!(index);
        } else {
          context.go(_tabs[index]['path']);
        }
      },
      type: BottomNavigationBarType.fixed,
      selectedItemColor: AppTheme.primary,
      unselectedItemColor: Colors.grey,
      selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500),
      items: _tabs.map((tab) {
        return BottomNavigationBarItem(
          icon: Icon(tab['icon']),
          label: tab['label'],
        );
      }).toList(),
    );
  }
}

class AppScaffold extends StatelessWidget {
  final Widget child;
  final String title;

  const AppScaffold({
    super.key,
    required this.child,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final role = authProvider.role?.name ?? '';
    
    int currentIndex = 0;
    final basePath = role == 'parent' ? '/parent' : '/student';
    final currentPath = GoRouterState.of(context).uri.toString();
    
    if (currentPath == basePath) {
      currentIndex = 0;
    } else if (currentPath.contains('/grades')) {
      currentIndex = 1;
    } else if (currentPath.contains('/schedule')) {
      currentIndex = 2;
    } else if (currentPath.contains('/more') || currentPath.contains('/payments')) {
      currentIndex = 3;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              authProvider.logout();
              context.go('/login');
            },
          ),
        ],
      ),
      body: child,
      bottomNavigationBar: BottomNavBar(
        currentIndex: currentIndex,
        role: role,
      ),
    );
  }
}

class ChildSelector extends StatefulWidget {
  final String selectedId;
  final Function(String) onSelect;
  final List<Map<String, String>> children;

  const ChildSelector({
    super.key,
    required this.selectedId,
    required this.onSelect,
    this.children = const [
      {'id': 's1', 'name': 'Amina Diallo'},
      {'id': 's2', 'name': 'Ibrahim Diallo'},
    ],
  });

  @override
  State<ChildSelector> createState() => _ChildSelectorState();
}

class _ChildSelectorState extends State<ChildSelector> {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: widget.children.map((child) {
          final isSelected = child['id'] == widget.selectedId;
          return Expanded(
            child: GestureDetector(
              onTap: () => widget.onSelect(child['id']!),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: isSelected ? AppTheme.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: Text(
                    child['name']!,
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.grey[600],
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}