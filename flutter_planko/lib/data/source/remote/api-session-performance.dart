import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/session-perfomance.dart';

class SessionPerformanceApiRemote {
  final ApiService apiService;

  SessionPerformanceApiRemote({required this.apiService});

  Future<List<PlankPerformanceModel>> getSessionPerformances() async {
    try {
      final response = await apiService.get('session-performance');
      // Assuming the API returns a list of performances directly or under a 'data' key
      final data = response.data is Map
          ? response.data['data'] ?? []
          : response.data;
      return (data as List)
          .map((x) => PlankPerformanceModel.fromJson(x))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<PlankPerformanceModel>> getSessionPerformancesByUserId(
    int userId,
  ) async {
    try {
      final response = await apiService.get(
        'session-performance?userId=$userId',
      );
      // Assuming the API returns a list of performances directly or under a 'data' key
      final data = response.data is Map
          ? response.data['data'] ?? []
          : response.data;
      return (data as List)
          .map((x) => PlankPerformanceModel.fromJson(x))
          .toList();
    } catch (e) {
      rethrow;
    }
  }
}
