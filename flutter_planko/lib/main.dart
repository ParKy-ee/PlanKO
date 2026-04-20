import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/pages/user/activity.dart';
import 'package:flutter_planko/UI/pages/user/calendar.dart';
import 'package:flutter_planko/UI/pages/user/profile.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';

import 'package:flutter_planko/routes.dart';

import 'package:flutter_planko/UI/pages/admin/dashboard.dart';
import 'package:flutter_planko/UI/pages/admin/program-manage.dart';
import 'package:flutter_planko/UI/pages/admin/user-manage.dart';
import 'package:flutter_planko/UI/pages/user/mission.dart';
import 'package:flutter_planko/UI/pages/user/register.dart';
import 'package:flutter_planko/UI/pages/user/user-detail.dart';
import 'package:flutter_planko/UI/pages/user/login.dart';
import 'package:flutter_planko/UI/pages/user/home.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(const ProviderScope(child: PlanKO()));
}

class PlanKO extends ConsumerWidget {
  const PlanKO({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ปรับให้เปิดหน้า Login เป็นหน้าแรกทันทีเพื่อทดสอบรันแค่หน้า Login ก่อร
    return _buildApp(AppRoutes.login);
  }

  Widget _buildApp(String initialRoute) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'PlanKO',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.blue),
      initialRoute: initialRoute,
      routes: {
        AppRoutes.userDetail: (context) => const UserDetailPage(),
        AppRoutes.login: (context) => const UserLoginPage(),
        AppRoutes.register: (context) => const RegisterPage(),
        AppRoutes.home: (context) => const HomePage(),
        AppRoutes.mission: (context) => const MissionPage(),
        AppRoutes.activity: (context) => const ActivityPage(),
        AppRoutes.calendar: (context) => const CalendarPage(),
        AppRoutes.profile: (context) => const ProfilePage(),

        // Admin Routes
        // '/admin/dashboard': (context) => const DashboardPage(),
        // '/admin/user-manage': (context) => const UserManagePage(),
        // '/admin/program-manage': (context) => const ProgramManagePage(),
      },
    );
  }
}
