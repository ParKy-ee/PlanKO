import 'package:flutter/foundation.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/models/quest-by-user-model.dart';
import 'package:flutter_planko/data/repositories/quest_by_user_repository_impl.dart';
import 'package:flutter_planko/data/source/remote/api-quest-by-user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// --- Service & Repository Providers ---

final questByUserApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ApiQuestByUserRemote(apiService: apiService);
});

final questByUserRepositoryProvider = Provider((ref) {
  final api = ref.watch(questByUserApiProvider);
  return QuestByUserRepositoryImpl(api: api);
});

// --- UI State Provider ---

class QuestByUserNotifier extends StateNotifier<List<QuestByUserModel>> {
  final QuestByUserRepositoryImpl repository;

  QuestByUserNotifier({required this.repository}) : super([]);

  Future<void> fetchQuestsByUser() async {
    try {
      final quests = await repository.getQuestsByUser();
      state = quests;
    } catch (e) {
      debugPrint("Error fetching quests by user: $e");
    }
  }
}

final questByUserProvider =
    StateNotifierProvider<QuestByUserNotifier, List<QuestByUserModel>>((ref) {
      final repository = ref.watch(questByUserRepositoryProvider);
      return QuestByUserNotifier(repository: repository);
    });
