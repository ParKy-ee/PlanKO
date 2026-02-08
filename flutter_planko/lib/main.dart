import 'dart:io';
import 'package:flutter/material.dart';
import 'pages/welcome.dart';
import 'pages/login.dart';
import 'pages/home.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';
import 'package:flutter/foundation.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  if (kIsWeb) {
    databaseFactory = databaseFactoryFfiWeb;
  } else if (Platform.isWindows || Platform.isLinux) {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }

  runApp(const PlanKO());
}

class PlanKO extends StatefulWidget {
  const PlanKO({super.key});

  @override
  State<PlanKO> createState() => _PlanKOState();
}

class _PlanKOState extends State<PlanKO> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/user': (context) => const WelcomePage(),
        '/': (context) => const LoginPage(),
        '/home': (context) => const HomePage(),
      },
    );
  }
}
