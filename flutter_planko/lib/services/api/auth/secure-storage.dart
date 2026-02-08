import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = const FlutterSecureStorage();

class SecureStorage {
  final _storage = const FlutterSecureStorage();

  static const _accesstoken = 'access_token';

  Future<void> writeAccessToken({required String accessToken}) async {
    await _storage.write(key: _accesstoken, value: accessToken);
  }

  Future<String?> readAccessToken() async {
    return await _storage.read(key: _accesstoken);
  }

  Future<void> deleteAccessToken() async {
    await _storage.delete(key: _accesstoken);
  }
}
