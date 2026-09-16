import 'package:flutter/material.dart';

class UserDetailHeader extends StatelessWidget {
  const UserDetailHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        SizedBox(height: 20),
        Text(
          'ข้อมูลส่วนตัว',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
      ],
    );
  }
}
