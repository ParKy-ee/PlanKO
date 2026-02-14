import 'package:dio/dio.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_planko/services/auth/secure-storage.dart';
import 'package:flutter_planko/services/api/interceptors/auth-interceptor.dart';

class Client {
  static final Client instance = Client.internal();
  late final Dio dio;

  factory Client() => instance;

  Client.internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://10.0.2.2:3001/api/v1',
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
        logPrint: (obj) => debugPrint(obj.toString()),
      ),
    );
  }

  Future<Map<String, dynamic>> getProfile() async {
    final response = await dio.get('/auth/profile');
    if (response.statusCode != 200) {
      throw Exception('Failed to load profile');
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
}
