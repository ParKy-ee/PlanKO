import 'dart:convert';
import 'package:flutter_planko/data/models/program-model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocalProgram {
  static const String _programKey = 'cache_program';

  Future<void> saveProgram(List<ProgramModel> programs) async {
    final prefs = await SharedPreferences.getInstance();
    final programsJson = jsonEncode(programs.map((p) => p.toJson()).toList());
    await prefs.setString(_programKey, programsJson);
  }

  Future<List<ProgramModel>?> getPrograms() async {
    final prefs = await SharedPreferences.getInstance();
    final programsJson = prefs.getString(_programKey);
    if (programsJson != null) {
      final List<dynamic> decoded = jsonDecode(programsJson);
      return decoded.map((json) => ProgramModel.fromJson(json)).toList();
    }
    return null;
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_programKey);
  }
}
