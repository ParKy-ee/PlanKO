import 'package:dio/dio.dart';
import 'package:flutter_planko/services/auth/secure-storage.dart';

class AuthInterceptor extends Interceptor {
  final SecureStorage _storage = SecureStorage();

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _storage.readAccessToken();

    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }
}
