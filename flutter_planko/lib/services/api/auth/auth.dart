import 'dart:convert';
import 'package:flutter_planko/services/api/auth/secure-storage.dart';
import 'package:http/http.dart' as http;

class AuthService {
  static const String baseUrl = 'http://localhost:3001/api/v1';

  static Future<String?> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/auth/login');
    final _storate = SecureStorage();

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 201) {
      final decodedBody = utf8.decode(response.bodyBytes);
      final data = jsonDecode(decodedBody);

      if (data['success'] == true) {
        await _storate.writeAccessToken(
          accessToken: data['data']['access_token'],
        );
        return data['data']['access_token'];
      }
    }

    return null;
  }
}
