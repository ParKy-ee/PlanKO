import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/widgets/navebar.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('โปรไฟล์')),
      body: const Center(child: Text('หน้าโปรไฟล์')),
      bottomNavigationBar: const SharedBottomNavBar(currentIndex: 3),
    );
  }
}
