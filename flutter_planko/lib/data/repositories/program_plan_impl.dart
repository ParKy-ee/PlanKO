import 'package:flutter_planko/data/models/program-plan.dart';
import 'package:flutter_planko/data/source/local/local-program-plan.dart';
import 'package:flutter_planko/data/source/remote/api-program-plan.dart';

abstract class ProgramPlanRepository {
  Future<List<ProgramPlanModel>> getProgramPlans(int programId);
}

class ProgramPlanRepositoryImpl implements ProgramPlanRepository {
  final ProgramPlanApiRemote api;
  final LocalProgramPlan local;

  ProgramPlanRepositoryImpl({required this.api, required this.local});

  @override
  Future<List<ProgramPlanModel>> getProgramPlans(int programId) async {
    return await api.getProgramPlans(programId);
  }
}
