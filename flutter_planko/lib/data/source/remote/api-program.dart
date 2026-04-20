import 'package:flutter/foundation.dart';
import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/program-model.dart';

class ProgramApi {
  final ApiService apiService;

  ProgramApi({required this.apiService});

  Future<List<ProgramModel>> getPrograms() async {
    try {
      final response = await apiService.get('program');

      if (response.statusCode == 200) {
        final data = response.data;
        final programsData = (data is Map && data.containsKey('data'))
            ? data['data']
            : data;
        return programsData
            .map<ProgramModel>((json) => ProgramModel.fromJson(json))
            .toList();
      }
      return [];
    } catch (e) {
      debugPrint("Error fetching programs: $e");
      return [];
    }
  }

  Future<List<ProgramModel>> getProgramById(int id) async {
    try {
      final response = await apiService.get('program/$id');
      return (response.data as List)
          .map((x) => ProgramModel.fromJson(x))
          .toList();
    } catch (e) {
      debugPrint("Error fetching program by id: $e");
      return [];
    }
  }
}
