import 'package:flutter/material.dart';
import 'package:flutter_planko/components/profile/Op-tile.dart';

Widget buildAdditionalOptions() {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 20),
    child: Column(
      children: [
        buildOptionTile(Icons.settings, "Settings", () {}),
        buildOptionTile(Icons.history, "History", () {}),
        buildOptionTile(Icons.logout, "Logout", () {}, isDestructive: true),
      ],
    ),
  );
}
