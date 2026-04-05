import 'package:flutter/material.dart';
import 'package:flutter_planko/services/api/client.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';

class CalendarPage extends StatefulWidget {
  const CalendarPage({super.key});

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  final Client _client = Client();
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  DateTime? _rangeStart;
  DateTime? _rangeEnd;
  bool _isLoading = true;
  String? _errorMessage;
  Map<String, dynamic>? _currentMission;
  final Set<int> _workWeekDays = {};

  @override
  void initState() {
    super.initState();
    _fetchMission();
  }

  Future<void> _fetchMission() async {
    try {
      // 1. Get profile to get User ID
      final profileResponse = await _client.getProfile();
      final userData = profileResponse['data']['user'];

      if (userData == null || userData['id'] == null) {
        throw Exception("User ID not found in profile");
      }

      int userId = userData['id'];

      // 2. Get Mission using User ID
      final missionResponse = await _client.getMission(userId);
      // Expected structure: { data: [ { ... }, { ... } ], meta: ... }
      final missionList = missionResponse['data'];

      if (missionList != null &&
          missionList is List &&
          missionList.isNotEmpty) {
        // 3. Take the latest mission (or filter by logic, assuming last is latest)
        final missionData = missionList.last;

        setState(() {
          _currentMission = missionData;
          if (missionData['startAt'] != null) {
            _rangeStart = DateTime.parse(missionData['startAt']);
          }
          if (missionData['endAt'] != null) {
            _rangeEnd = DateTime.parse(missionData['endAt']);
          }

          // Extract workdays
          _workWeekDays.clear();
          if (missionData['missionByPrograms'] != null) {
            final programs = missionData['missionByPrograms'];
            if (programs is List && programs.isNotEmpty) {
              for (var p in programs) {
                if (p['program'] != null && p['program']['workDays'] != null) {
                  final wd = p['program']['workDays'];
                  if (wd is List) {
                    for (var d in wd) {
                      if (d is int) {
                        // Map 0 (Sunday) to 7, keep others as is
                        _workWeekDays.add(d == 0 ? 7 : d);
                      }
                    }
                  }
                }
              }
            }
          }
          // Ensure focused day is within range if possible, or start date
          if (_rangeStart != null) {
            _focusedDay = _rangeStart!;
          }
          _isLoading = false;
        });
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  bool _isWorkDay(DateTime day) {
    if (_rangeStart == null || _rangeEnd == null) return false;

    // Normalize dates to ignore time
    final normalizedDay = DateTime(day.year, day.month, day.day);
    final start = DateTime(
      _rangeStart!.year,
      _rangeStart!.month,
      _rangeStart!.day,
    );
    final end = DateTime(_rangeEnd!.year, _rangeEnd!.month, _rangeEnd!.day);

    if (normalizedDay.isBefore(start) || normalizedDay.isAfter(end)) {
      return false;
    }

    return _workWeekDays.contains(day.weekday);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Mission Calendar',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.blue,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
          ? Center(child: Text('Error: $_errorMessage'))
          : Column(
              children: [
                if (_currentMission != null)
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Card(
                      color: Colors.blue.shade50,
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          children: [
                            Text(
                              'Current Mission: ${_currentMission!['target'] ?? 'Unknown'}',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            if (_rangeStart != null && _rangeEnd != null)
                              Text(
                                '${DateFormat.yMMMd().format(_rangeStart!)} - ${DateFormat.yMMMd().format(_rangeEnd!)}',
                                style: TextStyle(color: Colors.grey[700]),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                TableCalendar(
                  firstDay: DateTime.utc(2020, 1, 1),
                  lastDay: DateTime.utc(2030, 12, 31),
                  focusedDay: _focusedDay,
                  calendarFormat: _calendarFormat,

                  // rangeStartDay: _rangeStart, // Removed to avoid default range highlighting
                  // rangeEndDay: _rangeEnd,     // Removed to avoid default range highlighting
                  // rangeSelectionMode: RangeSelectionMode.toggledOn, // Removed
                  // alignment: Alignment.center, // Removed invalid property
                  onFormatChanged: (format) {
                    setState(() {
                      _calendarFormat = format;
                    });
                  },
                  onPageChanged: (focusedDay) {
                    _focusedDay = focusedDay;
                  },
                  calendarBuilders: CalendarBuilders(
                    defaultBuilder: (context, day, focusedDay) {
                      if (_isWorkDay(day)) {
                        return Container(
                          margin: const EdgeInsets.all(6.0),
                          alignment: Alignment.center,
                          decoration: const BoxDecoration(
                            color: Colors.blue,
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            '${day.day}',
                            style: const TextStyle(color: Colors.white),
                          ),
                        );
                      }
                      return null;
                    },
                    // Optional: You can also override todayBuilder if you want workdays to show even on today
                  ),
                  calendarStyle: const CalendarStyle(
                    // rangeHighlightColor: Color(0xFFBBDEFB), // Unused
                    todayDecoration: BoxDecoration(
                      color: Colors.orange,
                      shape: BoxShape.circle,
                    ),
                  ),
                  headerStyle: const HeaderStyle(
                    formatButtonVisible: false,
                    titleCentered: true,
                    titleTextStyle: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
