import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/data_provider.dart';
import '../../widgets/navigation_widgets.dart';
import '../../widgets/custom_widgets.dart';
import '../../theme/app_theme.dart';

class ParentScheduleScreen extends StatefulWidget {
  const ParentScheduleScreen({super.key});

  @override
  State<ParentScheduleScreen> createState() => _ParentScheduleScreenState();
}

class _ParentScheduleScreenState extends State<ParentScheduleScreen> {
  String _selectedChildId = 's1';

  void _ensureSelectedChild(DataProvider dataProvider) {
    final students = dataProvider.students;
    if (students.isEmpty) return;
    final exists = students.any((s) => s.id == _selectedChildId);
    if (!exists) {
      _selectedChildId = students.first.id;
    }
  }
  int _selectedDay = DateTime.now().weekday - 1; // 0 = Monday

  @override
  void initState() {
    super.initState();
    if (_selectedDay < 0 || _selectedDay > 4) {
      _selectedDay = 0; // Default to Monday
    }
  }

  @override
  Widget build(BuildContext context) {
    final dataProvider = Provider.of<DataProvider>(context);
    _ensureSelectedChild(dataProvider);
    final student = dataProvider.getStudentById(_selectedChildId);
    final schedule = dataProvider.getScheduleForStudent(_selectedChildId);
    final filteredSchedule = schedule
        .where((slot) => slot.day == _selectedDay)
        .toList()
      ..sort((a, b) => a.startTime.compareTo(b.startTime));

    final days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    if (student == null)
      return const Scaffold(body: Center(child: Text('Erreur')));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Emploi du temps'),
        backgroundColor: AppTheme.primary,
      ),
      body: RefreshIndicator(
        onRefresh: () async => setState(() {}),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 48, 20, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Emploi du temps',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${student.firstName} — ${student.className}',
                      style: AppTheme.caption,
                    ),
                  ],
                ),
              ),

              // Child selector
              ChildSelector(
                selectedId: _selectedChildId,
                onSelect: (id) => setState(() => _selectedChildId = id),
                children: dataProvider.students
                    .map((s) => {'id': s.id, 'name': '${s.firstName} ${s.lastName}'})
                    .toList(),
              ),
              const SizedBox(height: 16),

              // Day selector
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: List.generate(5, (index) {
                    final isToday = DateTime.now().weekday - 1 == index;
                    final isSelected = _selectedDay == index;

                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedDay = index),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 2),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppTheme.primary
                                : isToday
                                    ? Theme.of(context).highlightColor
                                    : Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Center(
                            child: Text(
                              days[index].substring(0, 3),
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: isSelected
                                    ? Colors.white
                                    : isToday
                                        ? AppTheme.primary
                                        : Colors.grey[600],
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
              const SizedBox(height: 24),

              // Schedule list
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: filteredSchedule.isEmpty
                    ? Center(
                        child: Column(
                          children: [
                            const SizedBox(height: 60),
                            Icon(
                              Icons.event_busy,
                              size: 48,
                              color: Colors.grey[400],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Pas de cours ce jour',
                              style: AppTheme.caption,
                            ),
                          ],
                        ),
                      )
                    : Column(
                        children: filteredSchedule.asMap().entries.map((entry) {
                          int index = entry.key;
                          var slot = entry.value;

                          return AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                            margin: const EdgeInsets.only(bottom: 16),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Time column
                                Container(
                                  width: 56,
                                  padding: const EdgeInsets.only(top: 12),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        slot.startTime,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        slot.endTime,
                                        style: AppTheme.caption,
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 12),

                                // Course card
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).cardColor,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: Theme.of(context).dividerColor,
                                      ),
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          slot.subject,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        Row(
                                          children: [
                                            const Icon(
                                              Icons.person,
                                              size: 14,
                                              color: Colors.grey,
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              slot.teacher,
                                              style: AppTheme.caption,
                                            ),
                                            const SizedBox(width: 16),
                                            const Icon(
                                              Icons.place,
                                              size: 14,
                                              color: Colors.grey,
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              slot.room,
                                              style: AppTheme.caption,
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}






