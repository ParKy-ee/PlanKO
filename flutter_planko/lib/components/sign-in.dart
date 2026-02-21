import 'package:flutter/material.dart';
import 'package:flutter_planko/pages/user/home.dart';
import 'package:flutter_planko/pages/user/welcome.dart';

import 'package:flutter_planko/services/api/client.dart';
import 'package:flutter_planko/services/auth/auth.dart';

class SignIn extends StatefulWidget {
  const SignIn({super.key});

  @override
  State<SignIn> createState() => _SignInState();
}

class _SignInState extends State<SignIn> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> login() async {
    String email = emailController.text.trim();
    String password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('กรุณากรอกข้อมูลให้ครบ')));
      return;
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Center(child: CircularProgressIndicator()),
    );

    try {
      final token = await AuthService.login(email, password);
      final user = await Client().getProfile();

      if (!mounted) return;
      Navigator.pop(context);

      if (token != null) {
        if (user['data']['user']['weight'] == null) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => WelcomePage()),
          );
        } else {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => HomePage()),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Email หรือ Password ไม่ถูกต้อง')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      Navigator.pop(context);

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('เกิดข้อผิดพลาด: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Container(
      width: screenWidth * 0.85,
      margin: EdgeInsets.only(top: 80),
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.red),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Sign in',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),

          SizedBox(height: 20),

          TextField(
            controller: emailController,
            decoration: InputDecoration(
              labelText: 'Email',
              border: OutlineInputBorder(),
            ),
          ),

          SizedBox(height: 12),

          TextField(
            controller: passwordController,
            obscureText: true,
            decoration: InputDecoration(
              labelText: 'Password',
              border: OutlineInputBorder(),
            ),
          ),

          SizedBox(height: 20),

          ElevatedButton(onPressed: login, child: Text('Sign in')),

          SizedBox(height: 12),

          Center(child: Text("Don't have an account?")),

          TextButton(
            onPressed: () => Navigator.pushNamed(context, '/register'),
            child: Text('Sign up'),
          ),
        ],
      ),
    );
  }
}
