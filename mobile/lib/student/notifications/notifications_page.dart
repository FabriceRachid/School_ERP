import 'package:flutter/material.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Notifications")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _NotificationTile("Devoir de maths demain"),
          _NotificationTile("Résultats publiés"),
        ],
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final String message;

  const _NotificationTile(this.message);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const Icon(Icons.notifications),
        title: Text(message),
      ),
    );
  }
}