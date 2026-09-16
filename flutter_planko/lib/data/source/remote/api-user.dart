import 'package:flutter_planko/data/models/user-model.dart';
import 'package:flutter_planko/core/services/api-service.dart';

class UserApiRemote {
  final ApiService apiService;

  UserApiRemote(this.apiService);

  Future<UserModel> getUser() async {
    final response = await apiService.get("auth/profile");

    if (response.data != null) {
      final userData = response.data['data'];
      if (userData != null && userData['user'] != null) {
        return UserModel.fromJson(userData['user']);
      }
    }
    throw Exception("Data structure error or user not found");
  }

  Future<UserModel> getUserById(String id) async {
    final response = await apiService.get("user?id=$id"); // ใช้ relative path

    if (response.data != null) {
      final userData = response.data is Map ? response.data['data'] : null;
      if (userData != null) {
        if (userData is List && userData.isNotEmpty) {
          return UserModel.fromJson(userData[0]);
        } else if (userData is Map<String, dynamic>) {
          return UserModel.fromJson(userData);
        }
      }
    }
    throw Exception("User ID $id not found");
  }

  Future<UserModel> updateUser(String id, UserModel user) async {
    final response = await apiService.put(
      "user/$id",
      user.toJson(),
    ); // ใช้ relative path

    if (response.data != null) {
      final userData = response.data is Map ? response.data['data'] : null;
      if (userData != null) {
        return UserModel.fromJson(userData);
      }
    }
    return user;
  }

  Future<UserModel?> deleteUser(String id) async {
    final response = await apiService.delete("user/$id"); // ใช้ relative path
    return null;
  }
}
