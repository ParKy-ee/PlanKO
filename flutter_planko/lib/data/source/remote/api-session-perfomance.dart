import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/session-perfomance.dart';
import 'package:flutter_planko/core/constants/API-constant.dart';

class ApiSessionPerformanceRemote {
  final ApiService apiService;

  ApiSessionPerformanceRemote({required this.apiService});

  Future<List<PlankPerformanceModel>> getSessionPerformances() async {
    final response = await apiService.get('session-performance');
    if (response.data != null) {
      final List data = response.data['data'] ?? [];
      return data.map((x) => PlankPerformanceModel.fromJson(x)).toList();
    }
    throw Exception('Failed to load session performances');
  }

  Future<PlankPerformanceModel> getSessionPerformanceByUserId(int userId) async {
    final response = await apiService.get('session-performance?userId=$userId');
    if (response.data != null) {
      final List data = response.data['data'] ?? [];
      if (data.isNotEmpty) {
        return PlankPerformanceModel.fromJson(data[0]);
      }
    }
    throw Exception('Failed to load session performance');
  }
}
