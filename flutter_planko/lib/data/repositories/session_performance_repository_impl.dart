import 'package:flutter_planko/data/models/session-perfomance.dart';
import 'package:flutter_planko/data/source/local/local-session-performance.dart';
import 'package:flutter_planko/data/source/remote/api-session-perfomance.dart';

class SessionPerformanceRepositoryImpl {
  final ApiSessionPerformanceRemote api;
  final LocalSessionPerformance local;

  SessionPerformanceRepositoryImpl({required this.api, required this.local});

  Future<List<PlankPerformanceModel>> getSessionPerformances() async {
    try {
      final performances = await api.getSessionPerformances();
      await local.saveSessionPerformances(performances);
      return performances;
    } catch (e) {
      final cached = await local.getSessionPerformances();
      if (cached != null) return cached;
      rethrow;
    }
  }

  Future<PlankPerformanceModel> getSessionPerformanceByUserId(int userId) async {
    // This one might not be cached individually in the same way, but let's follow the api
    return await api.getSessionPerformanceByUserId(userId);
  }
}
