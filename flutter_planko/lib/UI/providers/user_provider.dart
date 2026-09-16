import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/core/services/api-service.dart';
import 'package:flutter_planko/data/source/remote/api-user.dart';
import 'package:flutter_planko/data/source/local/local-user.dart';
import 'package:flutter_planko/data/repositories/user_repository_impl.dart';
import 'package:flutter_planko/data/models/user-model.dart';
import 'package:flutter_planko/data/services/api-auth.dart';

// --- Base Service Providers ---

// Provider สำหรับ ApiService (Dio)
final apiServiceProvider = Provider((ref) => ApiService());

// Provider สำหรับ UserApi (Remote)
final userApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return UserApiRemote(apiService);
});

// Provider สำหรับ UserLocal (Shared Preferences)
final userLocalProvider = Provider((ref) => LocalUser());

// --- Repository Provider ---

// Provider สำหรับ UserRepository (ตัวเชื่อมประสานงานหลัก)
final userRepositoryProvider = Provider((ref) {
  final api = ref.watch(userApiProvider);
  final local = ref.watch(userLocalProvider);
  return UserRepository(api: api, local: local);
});

// --- Data & State Providers (ใช้ในหน้า UI) ---

// FutureProvider สำหรับดึงข้อมูล User ปัจจุบันมาแสดงผลที่หน้าจอ
// UI สามารถใช้ ref.watch(userDataProvider) เพื่อแสดง Loading/Data/Error ได้ทันที
final userDataProvider = FutureProvider<UserModel>((ref) async {
  final repository = ref.watch(userRepositoryProvider);
  return await repository.getUser();
});

// Provider สำหรับ AuthApi
final authApiProvider = Provider((ref) => AuthApi());
