import 'package:flutter_planko/data/models/program-model.dart';
import 'package:flutter_planko/data/source/local/local-program.dart';
import 'package:flutter_planko/data/source/remote/api-program.dart';

class ProgramRepositoryImpl {
  final ProgramApi api;
  final LocalProgram local;

  ProgramRepositoryImpl({required this.api, required this.local});

  Future<List<ProgramModel>> getPrograms() async {
    try {
      final programs = await api.getPrograms();
      await local.saveProgram(programs);
      return programs;
    } catch (e) {
      final cachedPrograms = await local.getPrograms();
      if (cachedPrograms != null) return cachedPrograms;
      rethrow;
    }
  }
}
