import 'package:flutter/material.dart';
import 'package:flutter_planko/routes.dart';

class SharedBottomNavBar extends StatelessWidget {
  final int currentIndex;

  const SharedBottomNavBar({super.key, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(
        canvasColor: Colors.blue.shade500, // Solid blue background
      ),
      child: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.blue.shade500,
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.white70,
        showSelectedLabels: true,
        showUnselectedLabels: true,
        selectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
        unselectedLabelStyle: const TextStyle(fontSize: 12),
        currentIndex: currentIndex,
        onTap: (index) {
          if (index == currentIndex)
            return; // Do nothing if already on this page

          switch (index) {
            case 0:
              Navigator.pushReplacementNamed(context, AppRoutes.home);
              break;
            case 1:
              Navigator.pushReplacementNamed(context, AppRoutes.activity);
              break;
            case 2:
              Navigator.pushReplacementNamed(context, AppRoutes.calendar);
              break;
            case 3:
              Navigator.pushReplacementNamed(context, AppRoutes.profile);
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Padding(
              padding: EdgeInsets.only(bottom: 4.0),
              child: Icon(Icons.home),
            ),
            label: 'โฮม',
          ),
          BottomNavigationBarItem(
            icon: Padding(
              padding: EdgeInsets.only(bottom: 4.0),
              child: Icon(Icons.show_chart),
            ),
            label: 'กิจกรรม',
          ),
          BottomNavigationBarItem(
            icon: Padding(
              padding: EdgeInsets.only(bottom: 4.0),
              child: Icon(Icons.calendar_today_outlined),
            ),
            label: 'ปฏิทิน',
          ),
          BottomNavigationBarItem(
            icon: Padding(
              padding: EdgeInsets.only(bottom: 4.0),
              child: Icon(Icons.person_outline),
            ),
            label: 'โปรไฟล์',
          ),
        ],
      ),
    );
  }
}
