import 'package:flutter/foundation.dart';
import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/models/user-model.dart';

class UserDetailApi {
  final ApiService apiService;

  UserDetailApi({required this.apiService});

  Future<UserModel?> getUserDetail(String id) async {
    try {
      final response = await apiService.get('user/$id');

      if (response.statusCode == 200) {
        final data = response.data;
        final userData = (data is Map && data.containsKey('data'))
            ? data['data']
            : data;
        return UserModel.fromJson(userData);
      }
      return null;
    } catch (e) {
      debugPrint("Error fetching user detail: $e");
      return null;
    }
  }

  Future<UserModel?> updateUserDetail(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await apiService.put('user/$id', data);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData =
            (response.data is Map && response.data.containsKey('data'))
            ? response.data['data']
            : response.data;
        return UserModel.fromJson(responseData);
      }
      return null;
    } catch (e) {
      debugPrint("Error updating user detail: $e");
      return null;
    }
  }
}
