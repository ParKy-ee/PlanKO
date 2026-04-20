import 'package:flutter/material.dart';
import 'package:flutter_planko/data/services/api-register.dart';

class RegisterUtils {
  static Future<String?> handleRegister({
    required BuildContext context,
    required String email,
    required String name,
    required String password,
    required String confirm,
  }) async {
    if (email.isEmpty || name.isEmpty || password.isEmpty || confirm.isEmpty) {
      return 'กรุณากรอกข้อมูลให้ครบทุกช่อง';
    }

    if (password != confirm) {
      return 'รหัสผ่านไม่ตรงกัน';
    }

    // แสดง Loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator()),
    );

    try {
      final response = await RegisterApi.register({
        'email': email,
        'name': name,
        'password': password,
      });

      if (!context.mounted) return null;
      Navigator.pop(context); // ปิด Loading

      if (response['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('สร้างบัญชีผู้ใช้สำเร็จ!')),
        );
        Navigator.pop(context);
        return null;
      } else {
        String msg = response['message'] ?? 'ไม่สามารถสมัครใช้งานได้';

        if (msg.contains('Email')) {
          return 'อีเมลนี้ถูกใช้งานไปแล้ว';
        } else if (msg.contains('Name')) {
          return 'ชื่อผู้ใช้นี้ถูกใช้งานไปแล้ว';
        }

        return msg;
      }
    } catch (e) {
      if (!context.mounted) return null;
      Navigator.pop(context); // ปิด Loading
      return e.toString();
    }
  }
}
