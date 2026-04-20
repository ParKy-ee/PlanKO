import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/quest-by-user-model.dart';

class ApiQuestByUserRemote {
  final ApiService apiService;

  ApiQuestByUserRemote({required this.apiService});

  Future<List<QuestByUserModel>> getQuestsByUser() async {
    try {
      final response = await apiService.get('quest-by-uesr');
      if (response.data != null) {
        final data = response.data is Map ? response.data['data'] : response.data;
        if (data is List) {
          return data.map((x) => QuestByUserModel.fromJson(x)).toList();
        }
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
