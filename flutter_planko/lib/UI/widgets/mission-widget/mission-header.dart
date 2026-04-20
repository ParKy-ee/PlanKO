import 'package:flutter/material.dart';

class MissionHeader extends StatelessWidget {
  const MissionHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        SizedBox(height: 10),
        Text(
          'เริ่มเป้าหมายของคุณ',
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
