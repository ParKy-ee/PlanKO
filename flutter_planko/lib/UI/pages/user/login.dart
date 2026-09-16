import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/widgets/login-widget/login-header.dart'; // เปลี่ยน Path มาที่ widgets ของ user
import 'package:flutter_planko/UI/widgets/login-widget/login-form.dart'; // เปลี่ยน Path มาที่ widgets ของ user

class UserLoginPage extends StatelessWidget {
  const UserLoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(backgroundColor: Colors.white, elevation: 0),
      body: const SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 30),
          child: Column(
            children: [LoginHeader(), SizedBox(height: 40), LoginForm()],
          ),
        ),
      ),
    );
  }
}
