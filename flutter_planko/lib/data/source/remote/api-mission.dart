import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/mission-model.dart';

class MissionApiRemote {
  final ApiService apiService;

  MissionApiRemote({required this.apiService});

  Future<List<MissionModel>> getMissions() async {
    try {
      final response = await apiService.get('mission');
      return (response.data as List)
          .map((x) => MissionModel.fromJson(x))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<MissionModel>> getMissionById(int id) async {
    try {
      final response = await apiService.get('mission/$id');
      return (response.data as List)
          .map((x) => MissionModel.fromJson(x))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<MissionModel>> getMissionByUserId(String id) async {
    try {
      final response = await apiService.get('mission?userId=$id');

      if (response.data != null) {
        final missionData = response.data is Map ? response.data['data'] : response.data;
        if (missionData != null) {
          if (missionData is List) {
            return missionData.map((x) => MissionModel.fromJson(x)).toList();
          } else if (missionData is Map<String, dynamic>) {
            return [MissionModel.fromJson(missionData)];
          }
        }
      }
      return []; // Return empty list if no missions found
    } catch (e) {
      throw Exception("Mission for User ID $id not found");
    }
  }
}
