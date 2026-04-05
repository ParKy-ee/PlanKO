import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_planko/pages/admin/dashboard.dart';
import 'package:flutter_planko/pages/admin/program-manage.dart';
import 'package:flutter_planko/pages/admin/user-manage.dart';
import 'package:flutter_planko/pages/user/mission.dart';
import 'package:flutter_planko/pages/user/regiseter.dart';
import 'package:flutter_planko/services/api/client.dart';
import 'pages/welcome.dart';
import 'pages/login.dart';
import 'pages/home.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';
import 'package:flutter/foundation.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  if (kIsWeb) {
    databaseFactory = databaseFactoryFfiWeb;
  } else if (Platform.isWindows || Platform.isLinux) {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }

  runApp(PlanKO());
}

class PlanKO extends StatefulWidget {
  const PlanKO({super.key});

  @override
  State<PlanKO> createState() => _PlanKOState();
}

class _PlanKOState extends State<PlanKO> {
  final client = Client();

  Future<String> checkToken() async {
    try {
      final user = await client.getProfile();
      if (user.isNotEmpty) {
        final role = user['data']['role'];
        if (role == 'admin') {
          return '/admin/dashboard';
        }
      }
      return '/home';
    } catch (e) {
      return '/login';
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: checkToken(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            initialRoute: snapshot.data!,
            routes: {
              '/user': (context) => const WelcomePage(),
              '/login': (context) => const LoginPage(),
              '/home': (context) => const HomePage(),
              '/register': (context) => const RegisterPage(),
              '/admin/dashboard': (context) => const DashboardPage(),
              '/admin/user-manage': (context) => const UserManagePage(),
              '/admin/program-manage': (context) => const ProgramManagePage(),
              '/mission': (context) => const MissionPage(),
            },
          );
        }
        return const Center(child: CircularProgressIndicator());
      },
    );
  }
}
