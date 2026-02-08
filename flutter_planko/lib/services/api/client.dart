import 'package:dio/dio.dart';
import 'package:flutter_planko/services/api/auth/secure-storage.dart';
import 'package:flutter_planko/services/api/interceptors/auth-interceptor.dart';

class Client {
  static final Client _instace = Client._internal();
  late final Dio _dio;

  factory Client() => _instace;

  Client._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost:3001/api/v1',
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 5),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    _dio.interceptors.add(AuthInterceptor());
  }
}
