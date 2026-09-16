import 'package:flutter_planko/data/models/session-perfomance.dart';
import 'package:flutter_planko/data/source/remote/api-session-performance.dart';

class SessionPerformanceRepositoryImpl {
  final SessionPerformanceApiRemote api;

  SessionPerformanceRepositoryImpl({required this.api});

  Future<List<PlankPerformanceModel>> getSessionPerformances(int userId) async {
    return await api.getSessionPerformancesByUserId(userId);
  }
}
