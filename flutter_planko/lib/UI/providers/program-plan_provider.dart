import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/models/program-plan.dart';
import 'package:flutter_planko/data/repositories/program_plan_impl.dart';
import 'package:flutter_planko/data/source/local/local-program-plan.dart';
import 'package:flutter_planko/data/source/remote/api-program-plan.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/core/services/api-service.dart';

// --- Service & Repository Providers ---

final programPlanApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ProgramPlanApiRemote(apiService: apiService);
});

final programPlanLocalProvider = Provider((ref) => LocalProgramPlan());

final programPlanRepositoryProvider = Provider((ref) {
  final api = ref.watch(programPlanApiProvider);
  final local = ref.watch(programPlanLocalProvider);
  return ProgramPlanRepositoryImpl(api: api, local: local);
});

// --- UI State Provider ---

class ProgramPlanNotifier extends StateNotifier<List<ProgramPlanModel>> {
  final ProgramPlanRepositoryImpl repository;

  ProgramPlanNotifier({required this.repository}) : super([]);

  Future<void> fetchProgramPlans(int programId) async {
    try {
      final plans = await repository.getProgramPlans(programId);
      state = plans;
    } catch (e) {
      // Handle error
    }
  }
}

final programPlanProvider =
    StateNotifierProvider<ProgramPlanNotifier, List<ProgramPlanModel>>((ref) {
  final repository = ref.watch(programPlanRepositoryProvider);
  return ProgramPlanNotifier(repository: repository);
});

// Future provider for easy fetching in builders
final fetchProgramPlansProvider = FutureProvider.family<List<ProgramPlanModel>, int>((ref, programId) async {
  final repository = ref.watch(programPlanRepositoryProvider);
  return repository.getProgramPlans(programId);
});
