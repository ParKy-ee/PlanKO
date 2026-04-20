import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/widgets/user-detail-widget/user-detail-header.dart';
import 'package:flutter_planko/UI/widgets/user-detail-widget/user-detail-form.dart';

class UserDetailPage extends StatelessWidget {
  const UserDetailPage({super.key});

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
          padding: EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              UserDetailHeader(), // ส่วนหัวข้อ
              SizedBox(height: 40),
              UserDetailForm(),   // ส่วนฟอร์มและปุ่มบันทึก
            ],
          ),
        ),
      ),
    );
  }
}
