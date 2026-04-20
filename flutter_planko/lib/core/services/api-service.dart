import 'package:dio/dio.dart';
import 'package:flutter_planko/core/services/token-storage.dart';
import 'package:flutter_planko/core/constants/API-constant.dart';

class ApiService {
  late Dio dio;
  final SecureStorage _storage = SecureStorage();

  ApiService() {
    dio = Dio(
      BaseOptions(
        baseUrl: APIBase.baseUrl,
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 3),
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.readAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          options.headers['Content-Type'] = 'application/json';
          return handler.next(options);
        },
        onError: (DioException e, handler) {
          return handler.next(e);
        },
      ),
    );
  }

  Future<Response> get(String path) async {
    return await dio.get(path);
  }

  Future<Response> post(String path, dynamic data) async {
    return await dio.post(path, data: data);
  }

  Future<Response> put(String path, dynamic data) async {
    return await dio.put(path, data: data);
  }

  Future<Response> delete(String path) async {
    return await dio.delete(path);
  }
}
