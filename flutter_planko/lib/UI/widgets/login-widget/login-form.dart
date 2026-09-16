import 'package:flutter/material.dart';
import 'package:flutter_planko/core/Utils/login.dart';
import 'package:flutter_planko/UI/pages/user/register.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool _obscurePassword = true;
  String? _errorMessage;

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildLabel('ชื่อผู้ใช้งาน หรือ อีเมล'),
        const SizedBox(height: 8),
        _buildTextField(
          controller: emailController,
          hintText: 'กรอกที่อยู่ชื่อผู้ใช้งาน หรือ อีเมล',
          hasError: _errorMessage != null,
        ),
        const SizedBox(height: 20),
        _buildLabel('รหัสผ่าน'),
        const SizedBox(height: 8),
        _buildTextField(
          controller: passwordController,
          hintText: 'กรอกรหัสผ่าน',
          obscureText: _obscurePassword,
          hasError: _errorMessage != null,
          suffixIcon: IconButton(
            icon: Icon(
              _obscurePassword ? Icons.visibility_off : Icons.visibility,
              color: Colors.black87,
              size: 20,
            ),
            onPressed: () =>
                setState(() => _obscurePassword = !_obscurePassword),
          ),
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              _errorMessage!,
              style: const TextStyle(color: Colors.red, fontSize: 13),
            ),
          ),
        ],
        const SizedBox(height: 8),
        const Align(
          alignment: Alignment.centerRight,
          child: Text(
            'ลืมรหัสผ่าน?',
            style: TextStyle(color: Colors.black54, fontSize: 13),
          ),
        ),
        const SizedBox(height: 40),
        SizedBox(
          width: double.infinity,
          height: 55,
          child: ElevatedButton(
            onPressed: () {
              setState(() => _errorMessage = null);
              LoginUtils.handleLogin(
                context: context,
                name: emailController.text.trim(),
                password: passwordController.text.trim(),
                onError: (msg) => setState(() => _errorMessage = msg),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0084FF),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              elevation: 0,
            ),
            child: const Text(
              'ลงชื่อเข้าใช้',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ),
        const SizedBox(height: 30),
        _buildRegisterLink(),
      ],
    );
  }

  Widget _buildLabel(String text) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        text,
        style: const TextStyle(fontSize: 14, color: Colors.black87),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    bool obscureText = false,
    Widget? suffixIcon,
    bool hasError = false,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      onChanged: (_) {
        if (_errorMessage != null) setState(() => _errorMessage = null);
      },
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 13),
        filled: true,
        fillColor: hasError ? const Color(0xFFFFEBEE) : const Color(0xFFEAF5FF),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: hasError
              ? const BorderSide(color: Colors.red, width: 1)
              : BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: hasError
              ? const BorderSide(color: Colors.red, width: 1)
              : BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(
            color: hasError ? Colors.red : Colors.blue,
            width: 1.5,
          ),
        ),
        suffixIcon: suffixIcon,
      ),
    );
  }

  Widget _buildRegisterLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'คุณยังไม่มีบัญชีใช่ไหม? ',
          style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
        ),
        GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const RegisterPage()),
            );
          },
          child: const Text(
            'สร้างบัญชีผู้ใช้',
            style: TextStyle(
              color: Colors.black,
              fontSize: 13,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }
}
