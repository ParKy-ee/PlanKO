import 'package:flutter/foundation.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/data/models/program-model.dart';
import 'package:flutter_planko/data/repositories/program_repository_impl.dart';
import 'package:flutter_planko/data/source/remote/api-program.dart';
import 'package:flutter_planko/data/source/local/local-program.dart';

// --- Service & Repository Providers ---

final programApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ProgramApi(apiService: apiService);
});

final programLocalProvider = Provider((ref) => LocalProgram());

final programRepositoryProvider = Provider((ref) {
  final api = ref.watch(programApiProvider);
  final local = ref.watch(programLocalProvider);
  return ProgramRepositoryImpl(api: api, local: local);
});

// --- UI State Provider ---

class ProgramNotifier extends StateNotifier<List<ProgramModel>> {
  final ProgramRepositoryImpl repository;

  ProgramNotifier({required this.repository}) : super([]);

  Future<void> fetchPrograms() async {
    try {
      final programs = await repository.getPrograms();
      state = programs;
    } catch (e) {
      debugPrint("Error fetching programs: $e");
    }
  }
}

final programProvider =
    StateNotifierProvider<ProgramNotifier, List<ProgramModel>>((ref) {
  final repository = ref.watch(programRepositoryProvider);
  return ProgramNotifier(repository: repository);
});
