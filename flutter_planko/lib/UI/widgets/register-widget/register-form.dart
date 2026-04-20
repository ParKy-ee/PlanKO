import 'package:flutter/material.dart';
import 'package:flutter_planko/core/Utils/register.dart';

class RegisterForm extends StatefulWidget {
  const RegisterForm({super.key});

  @override
  State<RegisterForm> createState() => _RegisterFormState();
}

class _RegisterFormState extends State<RegisterForm> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;

  String? _emailError;
  String? _nameError;
  String? _passwordError;
  String? _confirmError;

  @override
  void dispose() {
    emailController.dispose();
    nameController.dispose();
    passwordController.dispose();
    confirmController.dispose();
    super.dispose();
  }

  void _clearErrors() {
    setState(() {
      _emailError = null;
      _nameError = null;
      _passwordError = null;
      _confirmError = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildLabel('อีเมล'),
        const SizedBox(height: 8),
        _buildTextField(
          controller: emailController,
          hintText: 'กรอกที่อยู่อีเมล',
          errorText: _emailError,
          onChanged: () => setState(() => _emailError = null),
        ),
        const SizedBox(height: 16),

        _buildLabel('ชื่อผู้ใช้งาน'),
        const SizedBox(height: 8),
        _buildTextField(
          controller: nameController,
          hintText: 'กรอกชื่อผู้ใช้งาน',
          errorText: _nameError,
          onChanged: () => setState(() => _nameError = null),
        ),
        const SizedBox(height: 16),

        _buildLabel('รหัสผ่าน'),
        const SizedBox(height: 8),
        _buildTextField(
          controller: passwordController,
          hintText: 'กรอกรหัสผ่าน',
          obscureText: _obscurePassword,
          errorText: _passwordError,
          onChanged: () => setState(() => _passwordError = null),
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
        const SizedBox(height: 16),

        _buildLabel('ยืนยันรหัสอีกครั้ง'),
        const SizedBox(height: 8),
        _buildTextField(
          controller: confirmController,
          hintText: 'กรอกรหัสผ่านอีกครั้ง',
          obscureText: _obscureConfirm,
          errorText: _confirmError,
          onChanged: () => setState(() => _confirmError = null),
          suffixIcon: IconButton(
            icon: Icon(
              _obscureConfirm ? Icons.visibility_off : Icons.visibility,
              color: Colors.black87,
              size: 20,
            ),
            onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
          ),
        ),

        const SizedBox(height: 40),

        SizedBox(
          width: double.infinity,
          height: 55,
          child: ElevatedButton(
            onPressed: () async {
              _clearErrors();
              final errorMsg = await RegisterUtils.handleRegister(
                context: context,
                email: emailController.text.trim(),
                name: nameController.text.trim(),
                password: passwordController.text.trim(),
                confirm: confirmController.text.trim(),
              );

              print(errorMsg);

              if (errorMsg != null) {
                setState(() {
                  final lowerError = errorMsg.toLowerCase();
                  if (lowerError.contains('ครบ')) {
                    if (emailController.text.isEmpty)
                      _emailError = 'กรุณากรอกข้อมูล';
                    if (nameController.text.isEmpty)
                      _nameError = 'กรุณากรอกข้อมูล';
                    if (passwordController.text.isEmpty)
                      _passwordError = 'กรุณากรอกข้อมูล';
                    if (confirmController.text.isEmpty)
                      _confirmError = 'กรุณากรอกข้อมูล';
                  } else if (lowerError.contains('รหัสผ่านไม่ตรงกัน') ||
                      lowerError.contains('password')) {
                    _passwordError = errorMsg;
                    _confirmError = errorMsg;
                  } else if (lowerError.contains('อีเมล') ||
                      lowerError.contains('email')) {
                    _emailError = errorMsg;
                  } else if (lowerError.contains('ชื่อ') ||
                      lowerError.contains('name')) {
                    _nameError = errorMsg;
                  } else {
                    // ถ้าแยกไม่ได้จริงๆ ให้โชว์ SnackBar แทนการเอาไปแปะไว้ช่องใดช่องหนึ่ง
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(errorMsg),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                });
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0084FF),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              elevation: 0,
            ),
            child: const Text(
              'สมัครใช้งาน',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ),

        const SizedBox(height: 30),

        _buildLoginLink(),
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
    String? errorText,
    VoidCallback? onChanged,
  }) {
    final hasError = errorText != null;
    return TextField(
      controller: controller,
      obscureText: obscureText,
      onChanged: (_) {
        if (onChanged != null) onChanged();
      },
      decoration: InputDecoration(
        hintText: hintText,
        errorText: errorText,
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
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.red, width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        ),
        suffixIcon: suffixIcon,
      ),
    );
  }

  Widget _buildLoginLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'คุณมีบัญชีอยู่แล้วใช่ไหม? ',
          style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
        ),
        GestureDetector(
          onTap: () => Navigator.pop(context),
          child: const Text(
            'ลงชื่อเข้าใช้',
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
