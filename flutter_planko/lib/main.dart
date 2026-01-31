import 'package:flutter/material.dart';
import 'pages/welcome.dart';
import 'pages/login.dart';
import 'pages/home.dart';

void main() {
  runApp(const PlanKO());
}

class PlanKO extends StatelessWidget {
  const PlanKO({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => const WelcomePage(),
        '/login': (context) => const LoginPage(),
        '/home': (context) => const HomePage(),
      },
    );
  }
}
