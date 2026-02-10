import 'package:flutter/material.dart';

class ParentPaymentsPage extends StatelessWidget {
  const ParentPaymentsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Paiements")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _PaymentTile("Janvier 2026", "Payé"),
          _PaymentTile("Février 2026", "Payé"),
          _PaymentTile("Mars 2026", "En attente"),
        ],
      ),
    );
  }
}

class _PaymentTile extends StatelessWidget {
  final String month;
  final String status;

  const _PaymentTile(this.month, this.status);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(month),
        trailing: Text(
          status,
          style: TextStyle(
            color: status == "Payé" ? Colors.green : Colors.orange,
          ),
        ),
      ),
    );
  }
}