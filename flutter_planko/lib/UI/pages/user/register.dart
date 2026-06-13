import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/widgets/register-widget/register-header.dart';
import 'package:flutter_planko/UI/widgets/register-widget/register-form.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: const SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 30),
          child: Column(
            children: [RegisterHeader(), SizedBox(height: 40), RegisterForm()],
          ),
        ),
      ),
    );
  }
}
