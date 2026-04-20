import 'dart:convert';
import 'package:flutter_planko/data/models/mission-model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocalMission {
  static const String _missionKey = 'cache_mission';

  Future<void> saveMission(List<MissionModel> missions) async {
    final prefs = await SharedPreferences.getInstance();
    final missionsJson = jsonEncode(missions.map((p) => p.toJson()).toList());
    await prefs.setString(_missionKey, missionsJson);
  }

  Future<List<MissionModel>?> getMissions() async {
    final prefs = await SharedPreferences.getInstance();
    final missionsJson = prefs.getString(_missionKey);
    if (missionsJson != null) {
      final List<dynamic> decoded = jsonDecode(missionsJson);
      return decoded.map((json) => MissionModel.fromJson(json)).toList();
    }
    return null;
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_missionKey);
  }
}
