import 'package:flutter/material.dart';
import 'package:flutter_planko/components/profile/State-Item.dart';

Widget buildStatsSection(Map<String, dynamic>? localUser) {
  final weight = localUser?['weight'] ?? '-';
  final height = localUser?['height'] ?? '-';
  final age = localUser?['age'] ?? '-';
  final gender = localUser?['gender'] ?? '-';

  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 20),
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          const Padding(
            padding: EdgeInsets.only(bottom: 20),
            child: Text(
              "Personal Info",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              buildStatItem(
                Icons.monitor_weight,
                "Weight",
                "$weight kg",
                Colors.blue,
              ),
              buildStatItem(Icons.height, "Height", "$height cm", Colors.green),
            ],
          ),
          const Divider(height: 30),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              buildStatItem(Icons.cake, "Age", "$age", Colors.orange),
              buildStatItem(Icons.wc, "Gender", "$gender", Colors.purple),
            ],
          ),
        ],
      ),
    ),
  );
}
