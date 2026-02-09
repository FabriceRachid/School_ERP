import 'package:flutter/material.dart';
import '../utils/responsive.dart';
import 'package:iconsax/iconsax.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
  final isMobile = Responsive.isMobile(context);

  return Scaffold(
  appBar: AppBar(title: const Text("Tableau de bord")),
  body: GridView.count(
  padding: const EdgeInsets.all(16),
  crossAxisCount: isMobile ? 2 : 4,
  crossAxisSpacing: 12,
  mainAxisSpacing: 12,
  children: const [

    DashboardCard("Élèves", Iconsax.profile_2user),
    DashboardCard("Notes", Iconsax.book),
    DashboardCard("Paiements", Iconsax.wallet),
    DashboardCard("Rapports", Iconsax.chart),
  ],
  ),
  );
  }
}

class DashboardCard extends StatelessWidget {
  final String title;
  final IconData icon;

  const DashboardCard(this.title, this.icon, {super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 40, color: Theme.of(context).primaryColor),
          const SizedBox(height: 10),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

