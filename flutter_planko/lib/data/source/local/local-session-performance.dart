import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_planko/data/models/session-perfomance.dart';

class LocalSessionPerformance {
  static const String _key = 'session_performances';

  Future<void> saveSessionPerformances(
    List<PlankPerformanceModel> performances,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    final data = performances.map((e) => e.toJson()).toList();
    await prefs.setString(_key, jsonEncode(data));
  }

  Future<List<PlankPerformanceModel>?> getSessionPerformances() async {
    final prefs = await SharedPreferences.getInstance();
    final dataString = prefs.getString(_key);
    if (dataString != null) {
      final List data = jsonDecode(dataString);
      return data.map((e) => PlankPerformanceModel.fromJson(e)).toList();
    }
    return null;
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
