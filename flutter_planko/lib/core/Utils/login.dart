import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/pages/user/home.dart';
import 'package:flutter_planko/UI/pages/user/mission.dart';

import 'package:flutter_planko/data/services/api-auth.dart' as auth;
import 'package:flutter_planko/UI/pages/user/user-detail.dart';

import 'package:flutter_planko/data/source/remote/api-mission.dart';
import 'package:flutter_planko/data/source/remote/api-user.dart';
import 'package:flutter_planko/core/services/api-service.dart';

class LoginUtils {
  static Future<void> handleLogin({
    required BuildContext context,
    required String name,
    required String password,
    void Function(String?)? onError,
  }) async {
    if (name.isEmpty || password.isEmpty) {
      if (onError != null) {
        onError('กรุณากรอกข้อมูลให้ครบ');
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('กรุณากรอกข้อมูลให้ครบ')));
      }
      return;
    }

    // แสดง Loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator()),
    );

    try {
      final userData = await auth.AuthApi.login(name, password);

      if (!context.mounted) return;
      Navigator.pop(context); // ปิด Loading

      if (userData != null) {
        // สร้าง Instance ของ API Service เพื่อดึงข้อมูล User จริงๆ มาตรวจสอบ
        final apiService = ApiService();
        final userApi = UserApiRemote(apiService);

        // แปลง id ที่ได้จาก userData เป็น String ก่อนส่งเข้า getUserById
        final userId = userData['user'] != null
            ? userData['user']['id'].toString()
            : userData['id'].toString();
        final user = await userApi.getUserById(userId);

        if (user.weight == 0 ||
            user.height == 0 ||
            user.age == 0 ||
            user.gender == null) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const UserDetailPage()),
          );
        } else {
          final MissionApi = MissionApiRemote(apiService: apiService);
          final mission = await MissionApi.getMissionByUserId(userId);

          if (mission.isNotEmpty && mission[0].missionByPrograms.isNotEmpty) {
            // ถ้ามี missionByPrograms แล้ว (เลือกโปรแกรมแล้ว) ให้ไปที่ HomePage
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => const HomePage()),
            );
          } else {
            // ถ้ายังไม่มี (หรือ List ว่าง) ให้ไปที่ MissionPage เพื่อเลือกโปรแกรม
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => const MissionPage()),
            );
          }
        }
      } else {
        if (onError != null) {
          onError('ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง');
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง'),
            ),
          );
        }
      }
    } catch (e) {
      if (!context.mounted) return;
      Navigator.pop(context); // ปิด Loading

      if (onError != null) {
        onError('เกิดข้อผิดพลาด: $e');
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('เกิดข้อผิดพลาด: $e')));
      }
    }
  }
}
