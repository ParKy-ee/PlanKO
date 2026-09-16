import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/program-plan.dart';

class ProgramPlanApiRemote {
  final ApiService apiService;

  ProgramPlanApiRemote({required this.apiService});

  Future<List<ProgramPlanModel>> getProgramPlans(int programId) async {
    try {
      final response = await apiService.get(
        'program-plan?programId=$programId',
      );

      if (response.data != null) {
        final planData = response.data is Map
            ? response.data['data']
            : response.data;
        if (planData != null) {
          if (planData is List) {
            return planData.map((x) => ProgramPlanModel.fromJson(x)).toList();
          } else if (planData is Map<String, dynamic>) {
            return [ProgramPlanModel.fromJson(planData)];
          }
        }
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
