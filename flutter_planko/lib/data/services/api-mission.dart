import 'package:flutter/foundation.dart';
import 'package:flutter_planko/core/services/api-service.dart';

class CreateMissionApi {
  final ApiService apiService;

  CreateMissionApi({required this.apiService});

  Future<bool> createMission(int userId, int programId, int period) async {
    final startAt = DateTime.now();
    final endAt = startAt.add(Duration(days: period));

    try {
      final response = await apiService.post('mission', {
        'userId': userId,
        'missionByProgramId': programId,
        'status': 'PENDING',
        'startAt': startAt.toIso8601String(),
        'endAt': endAt.toIso8601String(),
      });

      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      debugPrint("Error creating mission: $e");
      return false;
    }
  }

  Future<bool> updateMission(int id, int target) async {
    try {
      final response = await apiService.put('mission/$id', {'target': target});

      return response.statusCode == 200;
    } catch (e) {
      debugPrint("Error updating mission: $e");
      return false;
    }
  }

  Future<bool> deleteMission(int id) async {
    try {
      final response = await apiService.delete('mission/$id');

      return response.statusCode == 200;
    } catch (e) {
      debugPrint("Error deleting mission: $e");
      return false;
    }
  }
}
