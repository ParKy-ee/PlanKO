import 'package:dio/dio.dart';
import 'package:flutter_planko/services/auth/secure-storage.dart';
import 'package:flutter_planko/services/api/interceptors/auth-interceptor.dart';

class Client {
  static final Client _instace = Client._internal();
  late final Dio dio;

  factory Client() => _instace;

  Client._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://127.0.0.1:3001/api/v1',
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 5),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    dio.interceptors.add(AuthInterceptor());
  }

  Future<Map<String, dynamic>> getProfile() async {
    final token = await SecureStorage().readAccessToken();
    final response = await dio.get('/auth/profile');
    if (response.statusCode != 200) {
      throw Exception('Failed to load profile');
    }
    return response.data;
  }
}
