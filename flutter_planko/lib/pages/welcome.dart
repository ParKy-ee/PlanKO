import 'package:flutter/material.dart';

class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('PlanKO')),
      body: Center(
        child: Column(
          children: [
            Text('Welcome to PlanKO'),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/login', arguments: 'login');
              },
              child: Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
