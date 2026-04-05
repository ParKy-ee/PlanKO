import 'package:flutter/material.dart';
import 'package:flutter_planko/components/navbar.dart';
import 'package:flutter_planko/database/db_helper.dart';
import 'package:flutter_planko/pages/activity.dart';
import 'package:flutter_planko/pages/calendar.dart';
import 'package:flutter_planko/services/auth/secure-storage.dart';
import 'package:flutter_planko/pages/profile.dart';
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
            Text('Home Page'),
            ElevatedButton(onPressed: () => logout(), child: Text('Logout')),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/mission'),
              child: Text('Mission'),
            ),
          ],
        ),
      ),
    );
  }
}
