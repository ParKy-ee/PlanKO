import 'package:flutter/foundation.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/models/session-perfomance.dart';
import 'package:flutter_planko/data/repositories/session_performance_repository_impl.dart';
import 'package:flutter_planko/data/source/local/local-session-performance.dart';
import 'package:flutter_planko/data/source/remote/api-session-perfomance.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// --- Service & Repository Providers ---

final sessionPerformanceApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ApiSessionPerformanceRemote(apiService: apiService);
});

final sessionPerformanceLocalProvider = Provider((ref) => LocalSessionPerformance());

final sessionPerformanceRepositoryProvider = Provider((ref) {
  final api = ref.watch(sessionPerformanceApiProvider);
  final local = ref.watch(sessionPerformanceLocalProvider);
  return SessionPerformanceRepositoryImpl(api: api, local: local);
});

// --- UI State Provider ---

class SessionPerformanceNotifier extends StateNotifier<List<PlankPerformanceModel>> {
  final SessionPerformanceRepositoryImpl repository;

  SessionPerformanceNotifier({required this.repository}) : super([]);

  Future<void> fetchSessionPerformances() async {
    try {
      final performances = await repository.getSessionPerformances();
      state = performances;
    } catch (e) {
      debugPrint("Error fetching session performances: $e");
    }
  }
}

final sessionPerformanceProvider =
    StateNotifierProvider<SessionPerformanceNotifier, List<PlankPerformanceModel>>((ref) {
  final repository = ref.watch(sessionPerformanceRepositoryProvider);
  return SessionPerformanceNotifier(repository: repository);
});
