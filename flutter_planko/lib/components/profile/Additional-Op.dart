import 'package:flutter/material.dart';
import 'package:flutter_planko/components/profile/Op-tile.dart';
import 'package:flutter_planko/pages/login.dart';
import 'package:flutter_planko/services/api/client.dart';

Widget buildAdditionalOptions(BuildContext context) {
  final client = Client();

  void logout() async {
    try {
      await client.logout();

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => LoginPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('เกิดข้อผิดพลาด: $e')));
    }
  }

  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 20),
    child: Column(
      children: [
        buildOptionTile(Icons.settings, "Settings", () {}),
        buildOptionTile(Icons.history, "History", () {}),
        buildOptionTile(Icons.logout, "Logout", () {
          logout();
        }, isDestructive: true),
      ],
    ),
  );
}
