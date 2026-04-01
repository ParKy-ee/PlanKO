import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_planko/components/navbar.dart';
import 'package:flutter_planko/components/posture-card.dart';
import 'package:flutter_planko/database/db_helper.dart';
import 'package:flutter_planko/pages/user/activity.dart';
import 'package:flutter_planko/pages/user/calendar.dart';
import 'package:flutter_planko/services/auth/secure-storage.dart';
import 'package:flutter_planko/pages/user/profile.dart';
import 'package:flutter_planko/services/api/client.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = await DatabaseHelper.instance.readUser();
  }

  final List<Widget> _pages = [
    const HomeView(),
    const ActivityPage(),
    const CalendarPage(),
    const ProfilePage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: Navbar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Home();
  }
}

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final Client client = Client();
  List<dynamic> postureRaw = [];
  List<Map<String, dynamic>> postureList = [];

  initState() {
    super.initState();
    _getPosture();
  }

  Future<void> _getPosture() async {
    try {
      final response = await client.getPosture();
      setState(() {
        postureRaw = response['data'];
        postureList = postureRaw.cast<Map<String, dynamic>>();
      });
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  void logout() async {
    try {
      await client.logout();
    } catch (e) {
      debugPrint('Logout error: $e');
    } finally {
      await SecureStorage().deleteAccessToken();
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('PlanKO'), backgroundColor: Colors.blue),
      body: Center(
        child: Column(
          children: [
            SizedBox(
              child: Container(
                width: 500,
                height: 200,
                padding: EdgeInsets.all(10),
                margin: EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Text(
                          'แคลอรี่ที่เผาผลาญได้ทั้งหมด',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 100),
                        Align(
                          alignment: Alignment.topLeft,
                          child: Text(
                            '1,240 แคลอรี่',
                            style: TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            ElevatedButton(onPressed: () => logout(), child: Text('Logout')),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/mission'),
              child: Text('Mission'),
            ),

            Padding(
              padding: const EdgeInsets.only(left: 16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'ท่าแพลงก์',
                    style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF333333),
                    ),
                  ),
                ],
              ),
            ),
            PostureCard(posture: postureList),
          ],
        ),
      ),
    );
  }
}
