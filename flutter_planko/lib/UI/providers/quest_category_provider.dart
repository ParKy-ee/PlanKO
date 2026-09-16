import 'package:flutter/foundation.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/models/quest-category-model.dart';
import 'package:flutter_planko/data/repositories/quest_category_repository_impl.dart';
import 'package:flutter_planko/data/source/remote/api-quest-category.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// --- Service & Repository Providers ---

final questCategoryApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ApiQuestCategoryRemote(apiService: apiService);
});

final questCategoryRepositoryProvider = Provider((ref) {
  final api = ref.watch(questCategoryApiProvider);
  return QuestCategoryRepositoryImpl(api: api);
});

// --- UI State Provider ---

class QuestCategoryNotifier extends StateNotifier<List<QuestCategoryModel>> {
  final QuestCategoryRepositoryImpl repository;

  QuestCategoryNotifier({required this.repository}) : super([]);

  Future<void> fetchQuestCategories() async {
    try {
      final categories = await repository.getQuestCategories();
      state = categories;
    } catch (e) {
      debugPrint("Error fetching quest categories: $e");
    }
  }
}

final questCategoryProvider =
    StateNotifierProvider<QuestCategoryNotifier, List<QuestCategoryModel>>((ref) {
      final repository = ref.watch(questCategoryRepositoryProvider);
      return QuestCategoryNotifier(repository: repository);
    });
