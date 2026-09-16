import 'package:flutter_planko/data/source/remote/api-quest-category.dart';
import 'package:flutter_planko/data/models/quest-category-model.dart';

class QuestCategoryRepositoryImpl {
  final ApiQuestCategoryRemote api;

  QuestCategoryRepositoryImpl({required this.api});

  Future<List<QuestCategoryModel>> getQuestCategories() async {
    return await api.getQuestCategories();
  }
}
