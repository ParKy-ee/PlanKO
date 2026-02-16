import 'package:flutter/material.dart';
import 'package:flutter_planko/services/api/client.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class MissionPage extends StatefulWidget {
  const MissionPage({super.key});

  @override
  State<MissionPage> createState() => _MissionPageState();
}

class _MissionPageState extends State<MissionPage> {
  List<dynamic> _programs = [];
  bool _isLoading = true;
  final _targetController = TextEditingController(
    text: 'diet',
  ); // Default based on user example

  @override
  void dispose() {
    _targetController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _fetchPrograms();
  }

  Future<void> _fetchPrograms() async {
    try {
      final response = await Client().getPrograms();
      setState(() {
        _programs = response['data'];
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading programs: $e')));
      }
    }
  }

  Future<void> _createMission(Map<String, dynamic> program) async {
    final periodWeeks = program['period'] as int;
    final startAt = DateTime.now();
    final endAt = startAt.add(Duration(days: periodWeeks * 7));

    // Convert to ISO 8601 string as requested
    final startAtIso = startAt.toUtc().toIso8601String();
    final endAtIso = endAt.toUtc().toIso8601String();

    final userId = await FlutterSecureStorage().read(key: 'userId');

    try {
      await Client().createMission({
        'target': _targetController.text,
        'userId': userId,
        'startAt': startAtIso,
        'endAt': endAtIso,
        'status': 'PENDING',
        // User ID is handled by backend via token
        'missionByProgramId': program['id'],
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Mission created successfully!')),
        );
        Navigator.pop(context); // Or navigate to dashboard
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error creating mission: $e')));
      }
    }
  }

  void _showJoinConfirmation(Map<String, dynamic> program) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Join "${program['programName']}"?'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Type: ${program['programType']}'),
            Text('Period: ${program['period']} weeks'),
            Text('Frequency: ${program['frequency']} times/week'),
            const SizedBox(height: 16),
            TextField(
              controller: _targetController,
              decoration: const InputDecoration(
                labelText: 'Target Goal',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/home');
            },
            child: const Text('Join Mission'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Select a Mission')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _programs.isEmpty
          ? const Center(child: Text('No programs available'))
          : ListView.builder(
              itemCount: _programs.length,
              itemBuilder: (context, index) {
                final program = _programs[index];
                return Card(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      child: Icon(
                        program['programType'] == 'Weightloss'
                            ? Icons.arrow_downward
                            : Icons.fitness_center,
                      ),
                    ),
                    title: Text(program['programName']),
                    subtitle: Text(
                      '${program['period']} Weeks • ${program['frequency']} days/week',
                    ),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => _showJoinConfirmation(program),
                  ),
                );
              },
            ),
    );
  }
}
