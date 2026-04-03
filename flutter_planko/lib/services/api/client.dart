import 'package:dio/dio.dart';
import 'package:flutter_planko/services/auth/secure-storage.dart';
import 'package:flutter_planko/services/api/interceptors/auth-interceptor.dart';

class Client {
  static final Client instance = Client.internal();
  late final Dio dio;

  factory Client() => instance;

  Client.internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost:3001/api/v1',
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 5),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    dio.interceptors.add(AuthInterceptor());
    dio.interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        // logPrint: (obj) => debugPrint(obj.toString()),
      ),
    );
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    print(data);
    final response = await dio.put('/user/${data['id']}', data: data);
    if (response.statusCode != 200) {
      throw Exception('Failed to update profile');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> getProfile() async {
    final response = await dio.get('/auth/profile');
    if (response.statusCode != 200) {
      throw Exception('Failed to load profile');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await dio.post('/user', data: data);
    if (response.statusCode != 201) {
      throw Exception('Failed to register');
    }
    return response.data;
  }

  Future<void> logout() async {
    final response = await dio.post('/auth/logout');
    if (response.statusCode != 201) {
      throw Exception('Failed to logout');
    }
    await SecureStorage().deleteAccessToken();
  }

  Future<Map<String, dynamic>> createProgram(Map<String, dynamic> data) async {
    final response = await dio.post('/program', data: data);
    if (response.statusCode != 201) {
      throw Exception('Failed to create program');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> getPrograms() async {
    final response = await dio.get('/program');
    if (response.statusCode != 200) {
      throw Exception('Failed to get programs');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> updateProgram(
    int id,
    Map<String, dynamic> data,
  ) async {
    final response = await dio.put('/program/$id', data: data);
    if (response.statusCode != 200) {
      throw Exception('Failed to update program');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> deleteProgram(int id) async {
    final response = await dio.delete('/program/$id');
    if (response.statusCode != 200) {
      throw Exception('Failed to delete program');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> getPosture() async {
    final response = await dio.get('/posture');
    if (response.statusCode != 200) {
      throw Exception('Failed to get posture');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> getMission(int userId) async {
    final response = await dio.get('/mission?userId=$userId');
    if (response.statusCode != 200) {
      throw Exception('Failed to get mission');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> createMission(Map<String, dynamic> data) async {
    final response = await dio.post('/mission', data: data);
    if (response.statusCode != 201) {
      throw Exception('Failed to create mission');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> updateMission(
    int id,
    Map<String, dynamic> data,
  ) async {
    final response = await dio.put('/mission/$id', data: data);
    if (response.statusCode != 200) {
      throw Exception('Failed to update mission');
    }
    return response.data;
  }

  Future<Map<String, dynamic>> deleteMission(int id) async {
    final response = await dio.delete('/mission/$id');
    if (response.statusCode != 200) {
      throw Exception('Failed to delete mission');
    }
    return response.data;
  }
}
