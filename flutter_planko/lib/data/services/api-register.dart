import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_planko/core/constants/API-constant.dart';

class RegisterApi {
  static Future<Map<String, dynamic>> register(
    Map<String, dynamic> userData,
  ) async {
    final url = Uri.parse(UserApi.base);

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(userData),
      );

      print(response.body);

      final decodedBody = utf8.decode(response.bodyBytes);
      final data = jsonDecode(decodedBody);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return {
          'success': data['success'] ?? true,
          'message': data['message'], // เพิ่มบรรทัดนี้
        };
      }

      // ดึงข้อความ Error จาก API กลับไป
      String errorMessage = 'เกิดข้อผิดพลาด';
      if (data['message'] != null) {
        if (data['message'] is List) {
          errorMessage = data['message'].join('\n');
        } else {
          errorMessage = data['message'].toString();
        }
      }
      return {'success': false, 'message': errorMessage};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }
}
