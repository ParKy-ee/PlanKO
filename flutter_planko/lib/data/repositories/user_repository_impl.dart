import 'package:flutter_planko/core/constants/API-constant.dart';
import 'package:flutter_planko/data/models/user-model.dart';
import 'package:flutter_planko/data/source/remote/api-user.dart';
import 'package:flutter_planko/data/source/local/local-user.dart';

class UserRepository {
  final UserApiRemote api;
  final LocalUser local;

  UserRepository({required this.api, required this.local});

  // ดึงข้อมูลผู้ใช้จาก Server และบันทึกแคชลงเครื่อง
  Future<UserModel> getUser() async {
    try {
      final user = await api.getUser();
      await local.saveUser(user);
      return user;
    } catch (e) {
      // กรณี Error (เช่นไม่มีเน็ต) ให้ดึงข้อมูลล่าสุดจาก Local มาแสดง
      final cachedUser = await local.getUser();
      if (cachedUser != null) return cachedUser;
      rethrow;
    }
  }

  // ดึงข้อมูลที่แคชไว้ในเครื่อง
  Future<UserModel?> getCachedUser() async {
    return await local.getUser();
  }

  // อัปเดตข้อมูลผู้ใช้
  Future<UserModel> updateUser(int id, UserModel user) async {
    final updatedUser = await api.updateUser(id.toString(), user);
    await local.saveUser(updatedUser);
    return updatedUser;
  }

  // ล้างข้อมูลผู้ใช้ (Logout)
  Future<void> clearUser() async {
    await local.clear();
  }
}
