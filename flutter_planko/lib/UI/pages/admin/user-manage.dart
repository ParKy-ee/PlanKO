import 'package:flutter/material.dart';

class UserManagePage extends StatefulWidget {
  const UserManagePage({super.key});

  @override
  State<UserManagePage> createState() => _UserManagePageState();
}

class _UserManagePageState extends State<UserManagePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('User Manage')),
      body: const Center(child: Text('User Manage')),
    );
  }
}
