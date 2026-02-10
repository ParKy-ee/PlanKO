import 'package:flutter/material.dart';

Widget buildUserInfo(Map<String, dynamic>? profile) {
  return Column(
    children: [
      Text(
        profile?['name'] ?? 'Unknown User',
        style: const TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
      ),
      const SizedBox(height: 8),
      Text(
        profile?['email'] ?? 'No Email',
        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
      ),
    ],
  );
}
