import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/providers/mission_provider.dart';
import 'package:flutter_planko/UI/providers/program-plan_provider.dart';
import 'package:flutter_planko/UI/providers/session_performance_provider.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/UI/widgets/navebar.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CalendarPage extends ConsumerStatefulWidget {
  const CalendarPage({super.key});

  @override
  ConsumerState<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends ConsumerState<CalendarPage> {
  DateTime _currentMonth = DateTime.now();
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    Future.microtask(() async {
      final user = await ref.read(userDataProvider.future);
      ref.read(missionProvider.notifier).fetchMissions(user.id.toString());
    });
  }

  final List<String> _monthsShort = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];

  @override
  Widget build(BuildContext context) {
    final performanceAsync = ref.watch(fetchSessionPerformances);
    final missions = ref.watch(missionProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 32),
              const Text(
                'ปฏิทิน',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 32),
              performanceAsync.when(
                data: (performances) => Expanded(
                  child: ListView(
                    physics: const BouncingScrollPhysics(),
                    padding: EdgeInsets.zero,
                    children: [
                      _buildCalendarContainer(performances, missions),
                      const SizedBox(height: 24),
                      _buildSessionDetails(missions),
                    ],
                  ),
                ),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, _) => Center(child: Text('Error: $err')),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const SharedBottomNavBar(currentIndex: 2),
    );
  }

  Widget _buildCalendarContainer(performances, missions) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE0E0E0), width: 12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildCalendarHeader(),
            const SizedBox(height: 24),
            _buildWeekDaysRow(),
            const SizedBox(height: 12),
            _buildDynamicDaysGrid(performances, missions),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  Widget _buildCalendarHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () => setState(() {
            _currentMonth = DateTime(
              _currentMonth.year,
              _currentMonth.month - 1,
            );
            _selectedDay = null;
          }),
        ),
        Row(
          children: [
            _buildDropdown(_monthsShort[_currentMonth.month - 1]),
            const SizedBox(width: 8),
            _buildDropdown('${_currentMonth.year + 543}'),
          ],
        ),
        IconButton(
          icon: const Icon(Icons.chevron_right),
          onPressed: () => setState(() {
            _currentMonth = DateTime(
              _currentMonth.year,
              _currentMonth.month + 1,
            );
            _selectedDay = null;
          }),
        ),
      ],
    );
  }

  Widget _buildDropdown(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFFE0E0E0)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(text, style: const TextStyle(fontSize: 16)),
          const SizedBox(width: 4),
          const Icon(Icons.keyboard_arrow_down, size: 20),
        ],
      ),
    );
  }

  Widget _buildWeekDaysRow() {
    final List<String> weeks = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: weeks
          .map(
            (w) => Text(
              w,
              style: const TextStyle(color: Colors.grey, fontSize: 12),
            ),
          )
          .toList(),
    );
  }

  Widget _buildDynamicDaysGrid(performances, missions) {
    final firstDayOfMonth = DateTime(
      _currentMonth.year,
      _currentMonth.month,
      1,
    );
    final lastDayOfMonth = DateTime(
      _currentMonth.year,
      _currentMonth.month + 1,
      0,
    );
    final int firstWeekday = firstDayOfMonth.weekday % 7;
    final int totalDays = lastDayOfMonth.day;

    final mission = missions.isNotEmpty ? missions.first : null;
    final List<int> workDays = mission?.missionByPrograms.isNotEmpty == true
        ? (mission!.missionByPrograms[0].program?.workDays ?? [])
        : [];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: 42,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7,
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
      ),
      itemBuilder: (context, index) {
        final int dayOffset = index - firstWeekday;
        final DateTime date = firstDayOfMonth.add(Duration(days: dayOffset));
        final bool isCurrentMonth = date.month == _currentMonth.month;

        if (!isCurrentMonth && index < firstWeekday) return const SizedBox();
        if (!isCurrentMonth && index >= firstWeekday + totalDays) {
          return Center(
            child: Text(
              '${date.day}',
              style: TextStyle(
                color: Colors.grey.withOpacity(0.4),
                fontSize: 16,
              ),
            ),
          );
        }

        final bool isCompleted = performances.any((p) {
          final pDate = DateTime.parse(p.createdAt);
          return pDate.year == date.year &&
              pDate.month == date.month &&
              pDate.day == date.day;
        });

        bool isPlanned = false;
        if (mission != null && isCurrentMonth) {
          final startDate = DateTime.parse(mission.startAt).toLocal();
          final endDate = DateTime.parse(mission.endAt).toLocal();
          final checkDate = DateTime(date.year, date.month, date.day);
          final start = DateTime(
            startDate.year,
            startDate.month,
            startDate.day,
          );
          final end = DateTime(endDate.year, endDate.month, endDate.day);

          if ((checkDate.isAtSameMomentAs(start) || checkDate.isAfter(start)) &&
              (checkDate.isAtSameMomentAs(end) || checkDate.isBefore(end))) {
            isPlanned = workDays.contains(date.weekday);
          }
        }

        final bool isSelected =
            _selectedDay != null &&
            _selectedDay!.year == date.year &&
            _selectedDay!.month == date.month &&
            _selectedDay!.day == date.day;

        Color textColor = Colors.black;
        Color bgColor = Colors.transparent;
        BoxBorder? border;

        if (isCompleted) {
          textColor = Colors.white;
          bgColor = const Color(0xFF007AFF);
        } else if (isPlanned) {
          bgColor = const Color(0xFFE8E8E8);
        }

        if (isSelected) {
          border = Border.all(color: const Color(0xFF007AFF), width: 2);
        }

        return GestureDetector(
          onTap: () {
            if (isPlanned || isCompleted) {
              setState(() {
                _selectedDay = date;
              });
            }
          },
          child: Container(
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(8),
              border: border,
            ),
            child: Center(
              child: Text(
                '${date.day}',
                style: TextStyle(
                  color: textColor,
                  fontWeight: isCompleted || isSelected
                      ? FontWeight.bold
                      : FontWeight.normal,
                  fontSize: 16,
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSessionDetails(List missions) {
    if (_selectedDay == null) return const SizedBox();

    final mission = missions.isNotEmpty ? missions.first : null;
    if (mission == null) return const SizedBox();

    final programId = (mission.missionByPrograms.isNotEmpty == true)
        ? mission.missionByPrograms[0].program?.id
        : null;

    if (programId == null) return const SizedBox();

    final List<int> workDays =
        mission.missionByPrograms[0].program?.workDays ?? [];
    if (workDays.isEmpty) return const SizedBox();

    // Calculate how many work days have passed since the start of the mission
    final startDate = DateTime.parse(mission.startAt).toLocal();
    final start = DateTime(startDate.year, startDate.month, startDate.day);
    final selected = DateTime(
      _selectedDay!.year,
      _selectedDay!.month,
      _selectedDay!.day,
    );

    int workDayIndex = 0; // 0-indexed day of the workout plan
    DateTime tempDate = start;
    while (!tempDate.isAfter(selected)) {
      if (workDays.contains(tempDate.weekday)) {
        workDayIndex++;
      }
      tempDate = tempDate.add(const Duration(days: 1));
    }

    // If selected day is a rest day, workDayIndex will be same as previous work day but tempDate loop ended.
    // However, our calendar onTap only allows selecting isPlanned or isCompleted days.
    if (workDayIndex == 0) return const SizedBox();

    final plansAsync = ref.watch(fetchProgramPlansProvider(programId));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'กำหนดการวันที่ ${_selectedDay!.day} ${_monthsShort[_selectedDay!.month - 1]}',
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        plansAsync.when(
          data: (plans) {
            if (plans.isEmpty) return const Text('ไม่มีกำหนดการสำหรับวันนี้');

            // Sort by order
            final sortedPlans = [...plans]
              ..sort((a, b) => a.order.compareTo(b.order));

            // Pick the session for this specific work day (1 day 1 session)
            // Use modulo to cycle if workDayIndex exceeds number of sessions
            final planIndex = (workDayIndex - 1) % sortedPlans.length;
            final plan = sortedPlans[planIndex];

            return _buildSessionCard(plan);
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, _) => Text('Error: $err'),
        ),
      ],
    );
  }

  Widget _buildSessionCard(plan) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
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
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: const Color(0xFF007AFF).withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.play_arrow, color: Color(0xFF007AFF)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  plan.plankSession.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  '${plan.plankSession.totalScore} คะแนน',
                  style: const TextStyle(color: Colors.grey, fontSize: 14),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.grey),
        ],
      ),
    );
  }
}
