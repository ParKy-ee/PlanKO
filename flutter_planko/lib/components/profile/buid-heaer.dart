import 'package:flutter/material.dart';

Widget buildHeader() {
  return Stack(
    alignment: Alignment.bottomCenter,
    clipBehavior: Clip.none,
    children: [
      Container(
        height: 220,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF2196F3), Color(0xFF64B5F6)],
          ),
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
        ),
      ),
      Positioned(
        bottom: -50,
        child: Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                spreadRadius: 2,
              ),
            ],
          ),
          child: const CircleAvatar(
            radius: 50,
            backgroundColor: Color(0xFFF5F5F5),
            child: Icon(Icons.person, size: 50, color: Colors.grey),
          ),
        ),
      ),
    ],
  );
}
