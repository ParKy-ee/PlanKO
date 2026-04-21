import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/session-perfomance.dart';
import 'package:flutter_planko/data/repositories/session_performance_repository_impl.dart';
import 'package:flutter_planko/data/source/remote/api-session-performance.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// --- Service & Repository Providers ---

final sessionPerformanceApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return SessionPerformanceApiRemote(apiService: apiService);
});

final sessionPerformanceRepositoryProvider = Provider((ref) {
  final api = ref.watch(sessionPerformanceApiProvider);
  return SessionPerformanceRepositoryImpl(api: api);
});

// --- State Notifier ---

class SessionPerformanceNotifier
    extends StateNotifier<List<PlankPerformanceModel>> {
  final SessionPerformanceRepositoryImpl repository;

  SessionPerformanceNotifier({required this.repository}) : super([]);

  Future<void> fetchSessionPerformances(int userId) async {
    try {
      final performances = await repository.getSessionPerformances(userId);
      print(performances);
      state = performances;
    } catch (e) {
      // ignore errors for now, could add logging
    }
  }
}

final sessionPerformanceProvider =
    StateNotifierProvider<
      SessionPerformanceNotifier,
      List<PlankPerformanceModel>
    >((ref) {
      final repository = ref.watch(sessionPerformanceRepositoryProvider);
      return SessionPerformanceNotifier(repository: repository);
    });
