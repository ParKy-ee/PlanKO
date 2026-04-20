import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/program_provider.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/models/program-model.dart';
import 'package:flutter_planko/data/services/api-mission.dart';
import 'package:flutter_planko/routes.dart';

class MissionList extends ConsumerStatefulWidget {
  const MissionList({super.key});

  @override
  ConsumerState<MissionList> createState() => _MissionListState();
}

class _MissionListState extends ConsumerState<MissionList> {
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(programProvider.notifier).fetchPrograms();
    });
  }

  String _getDayName(int day) {
    const days = {
      1: 'จันทร์',
      2: 'อังคาร',
      3: 'พุธ',
      4: 'พฤหัสบดี',
      5: 'ศุกร์',
      6: 'เสาร์',
      7: 'อาทิตย์',
    };
    return days[day] ?? '';
  }

  void _showProgramDetail(ProgramModel program) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'แผน ${program.programName}',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  program.programType,
                  style: const TextStyle(fontSize: 16, color: Colors.black87),
                ),
                const SizedBox(height: 24),
                _buildInfoRow('ใช้ระยะเวลา : ', '${program.period} วัน'),
                _buildInfoRow(
                  'วันออกกำลังกาย : ',
                  program.workDay.map(_getDayName).join(', '),
                ),
                _buildInfoRow(
                  'วันพัก : ',
                  program.restDays.map(_getDayName).join(', '),
                ),
                const SizedBox(height: 16),
                const Text(
                  'ตัวอย่างท่า',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStepImage(Icons.accessibility_new),
                    _buildStepImage(Icons.directions_run),
                    _buildStepImage(Icons.fitness_center),
                  ],
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 55,
                  child: ElevatedButton(
                    onPressed: () =>
                        _handleStartMission(program.id, program.period),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0084FF),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      'เริ่มต้น',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: RichText(
        text: TextSpan(
          style: const TextStyle(fontSize: 15, color: Colors.black87),
          children: [
            TextSpan(
              text: label,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            TextSpan(text: value),
          ],
        ),
      ),
    );
  }

  Widget _buildStepImage(IconData icon) {
    return Container(
      width: 70,
      height: 70,
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, size: 40, color: Colors.blue),
    );
  }

  Future<void> _handleStartMission(int programId, int period) async {
    final userAsync = ref.read(userDataProvider);
    final user = userAsync.value;
    print(user);

    if (user == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('กรุณาล็อกอินก่อน')));
      return;
    }

    final apiService = ref.read(apiServiceProvider);
    final missionApi = CreateMissionApi(apiService: apiService);

    setState(() => _isLoading = true);
    final success = await missionApi.createMission(user.id, programId, period);
    if (mounted) setState(() => _isLoading = false);

    if (success) {
      if (mounted) {
        Navigator.pop(context); // Close dialog
        Navigator.pushReplacementNamed(context, AppRoutes.home);
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('ไม่สามารถสร้าง Mission ได้')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final programs = ref.watch(programProvider);

    return Stack(
      children: [
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: programs.length,
          separatorBuilder: (context, index) => const SizedBox(height: 20),
          itemBuilder: (context, index) {
            final program = programs[index];
            return _buildProgramCard(program);
          },
        ),
        if (_isLoading)
          const Positioned.fill(
            child: Center(child: CircularProgressIndicator()),
          ),
      ],
    );
  }

  Widget _buildProgramCard(ProgramModel program) {
    return GestureDetector(
      onTap: () => _showProgramDetail(program),
      child: Container(
        height: 130,
        decoration: BoxDecoration(
          color: const Color(0xFF0084FF),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            const SizedBox(width: 12),
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.9),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Center(
                child: Icon(Icons.fitness_center, size: 50, color: Colors.blue),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    program.programName,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'ระยะเวลา: ${program.period} วัน',
                    style: const TextStyle(fontSize: 14, color: Colors.white70),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    program.programType,
                    style: const TextStyle(fontSize: 12, color: Colors.white),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
