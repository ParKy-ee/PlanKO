import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:flutter_planko/core/services/api-service.dart';
import '../models/dashboard-model.dart';

class DashboardApi {
  final ApiService apiService;

  DashboardApi({required this.apiService});

  /// Fetch the home dashboard data for a specific user
  Future<DashboardModel?> getDashboardData(int userId) async {
    try {
      // NOTE: ApiService handles base URL appropriately 
      final response = await apiService.get('home-dashboard?userId=$userId');

      if (response.statusCode == 200) {
        final jsonResponse = response.data;
        
        // Ensure successful standard response wrapper
        if (jsonResponse['status'] == true && jsonResponse['data'] != null) {
          return DashboardModel.fromJson(jsonResponse['data']);
        }
      }
      return null;
    } catch (e) {
      debugPrint("Error fetching dashboard data: $e");
      return null;
    }
  }
}
