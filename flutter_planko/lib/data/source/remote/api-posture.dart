import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/posture.dart';

class ApiPostureRemote {
  final ApiService apiService;

  ApiPostureRemote({required this.apiService});

  Future<List<PostureModel>> getPostures() async {
    try {
      final response = await apiService.get('posture');
      if (response.data != null) {
        final data = response.data is Map ? response.data['data'] : response.data;
        if (data is List) {
          return data.map((x) => PostureModel.fromJson(x)).toList();
        }
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
