import 'package:flutter/foundation.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/models/mission-model.dart';
import 'package:flutter_planko/data/repositories/mission_repository_impl.dart';
import 'package:flutter_planko/data/source/local/local-mission.dart';
import 'package:flutter_planko/data/source/remote/api-mission.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// --- Service & Repository Providers ---

final missionApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return MissionApiRemote(apiService: apiService);
});

final missionLocalProvider = Provider((ref) => LocalMission());

final missionRepositoryProvider = Provider((ref) {
  final api = ref.watch(missionApiProvider);
  final local = ref.watch(missionLocalProvider);
  return MissionRepositoryImpl(api: api, local: local);
});

// --- UI State Provider ---

class MissionNotifier extends StateNotifier<List<MissionModel>> {
  final MissionRepositoryImpl repository;

  MissionNotifier({required this.repository}) : super([]);

  Future<void> fetchMissions() async {
    try {
      final missions = await repository.getMissions();
      state = missions;
    } catch (e) {
      debugPrint("Error fetching missions: $e");
    }
  }
}

final missionProvider =
    StateNotifierProvider<MissionNotifier, List<MissionModel>>((ref) {
      final repository = ref.watch(missionRepositoryProvider);
      return MissionNotifier(repository: repository);
    });
