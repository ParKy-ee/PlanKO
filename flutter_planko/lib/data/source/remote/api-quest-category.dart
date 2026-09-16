import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/quest-category-model.dart';

class ApiQuestCategoryRemote {
  final ApiService apiService;

  ApiQuestCategoryRemote({required this.apiService});

  Future<List<QuestCategoryModel>> getQuestCategories() async {
    try {
      final response = await apiService.get('quest-category');
      if (response.data != null) {
        final data = response.data is Map ? response.data['data'] : response.data;
        if (data is List) {
          return data.map((x) => QuestCategoryModel.fromJson(x)).toList();
        }
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
