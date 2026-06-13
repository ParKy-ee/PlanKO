import 'package:flutter_planko/data/models/mission-model.dart';
import 'package:flutter_planko/data/source/local/local-mission.dart';
import 'package:flutter_planko/data/source/remote/api-mission.dart';

class MissionRepositoryImpl {
  final MissionApiRemote api;
  final LocalMission local;

  MissionRepositoryImpl({required this.api, required this.local});

  Future<List<MissionModel>> getMissions() async {
    try {
      final missions = await api.getMissions();
      await local.saveMission(missions);
      return missions;
    } catch (e) {
      final cachedMissions = await local.getMissions();
      if (cachedMissions != null) return cachedMissions;
      rethrow;
    }
  }

  Future<List<MissionModel>> getMissionByUserId(String userId) async {
    try {
      final missions = await api.getMissionByUserId(userId);
      await local.saveMission(missions);
      return missions;
    } catch (e) {
      final cachedMissions = await local.getMissions();
      if (cachedMissions != null) return cachedMissions;
      rethrow;
    }
  }
}
