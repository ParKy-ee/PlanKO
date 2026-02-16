import 'package:flutter/material.dart';
import 'package:flutter_planko/components/profile/Additional-Op.dart';
import 'package:flutter_planko/components/profile/State-Section.dart';
import 'package:flutter_planko/components/profile/buid-heaer.dart';
import 'package:flutter_planko/components/profile/build-info.dart';
import 'package:flutter_planko/database/db_helper.dart';
import 'package:flutter_planko/services/api/client.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final Client client = Client();
  Map<String, dynamic>? profile;
  Map<String, dynamic>? localUser;
  List<dynamic>? missions;
  bool isLoading = true;
  String error = '';

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final response = await client.getProfile();
      final user = await DatabaseHelper.instance.getUser();
      final missionResponse = await client.getMission();

      if (!mounted) return;

      setState(() {
        if (response['data'] != null) {
          profile = Map<String, dynamic>.from(response['data']);
        }
        if (missionResponse['data'] != null) {
          missions = missionResponse['data'];
        }
        localUser = user.isNotEmpty
            ? Map<String, dynamic>.from(user.first)
            : null;
        isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        error = e.toString();
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (error.isNotEmpty) {
      return Scaffold(body: Center(child: Text('Error: $error')));
    }

    return Scaffold(
      backgroundColor: Colors.grey[50],
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text(
          'Profile',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            buildHeader(),
            const SizedBox(height: 50),
            buildUserInfo(profile),
            const SizedBox(height: 30),
            buildStatsSection(localUser),
            const SizedBox(height: 30),
            _buildMissionSection(),
            const SizedBox(height: 30),
            buildAdditionalOptions(context),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildMissionSection() {
    if (missions == null || missions!.isEmpty) {
      return const SizedBox.shrink();
    }

    final mission = missions!.last; // Display the latest mission
    final missionByPrograms = mission['missionByPrograms'] as List?;

    if (missionByPrograms == null || missionByPrograms.isEmpty) {
      return const SizedBox.shrink();
    }

    // Assuming we want to show the program from the first entry if multiple exist
    final programData = missionByPrograms.first['program'];

    if (programData == null) {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.blue.shade800, Colors.blue.shade500],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.3),
            offset: const Offset(0, 10),
            blurRadius: 20,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'ACTIVE PROGRAM',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      programData['programName'] ?? 'No Program Name',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: const Icon(
                  Icons.fitness_center_rounded,
                  color: Colors.white,
                  size: 28,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildInfoRow(
            Icons.category_rounded,
            'Type',
            programData['programType'] ?? 'General',
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildInfoRow(
                  Icons.calendar_today_rounded,
                  'Period',
                  '${programData['period']} Days',
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Divider(color: Colors.white24),
          const SizedBox(height: 16),
          const Text(
            'SCHEDULE',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          _buildDayPills(
            'Work Days',
            programData['workDays'],
            Colors.white,
            Colors.blue.shade900,
          ),
          const SizedBox(height: 12),
          _buildDayPills(
            'Rest Days',
            programData['restDays'],
            Colors.white54,
            Colors.white10,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: Colors.white70, size: 18),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(color: Colors.white60, fontSize: 12),
            ),
            Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDayPills(
    String label,
    dynamic daysData,
    Color textColor,
    Color bgColor,
  ) {
    if (daysData == null || daysData is! List || daysData.isEmpty) {
      return const SizedBox.shrink();
    }

    final days = daysData.map((d) => _getDayName(d)).join(', ');

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            label,
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Expanded(
          child: Text(
            days,
            style: TextStyle(
              color: textColor,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }

  String _getDayName(dynamic day) {
    const days = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ]; // 0 is usually Sun, adjust if 1 is Mon
    // Based on user data: workDays: [1,2,3,4,5] restDays: [6,0]. 1-5 Mon-Fri, 6-0 Sat-Sun.
    // So mapping matches standard JS Date.getDay() (0=Sun, 1=Mon...).
    // Assuming backend also uses 0-6 or 1-7. If user data has 0, likely 0=Sun.

    int index = day is int ? day : int.tryParse(day.toString()) ?? 0;
    if (index >= 0 && index < days.length) {
      return days[index];
    }
    return '';
  }
}
