import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/quest_by_user_provider.dart';
import 'package:flutter_planko/UI/providers/posture_provider.dart';
import 'package:flutter_planko/UI/providers/quest_category_provider.dart';
import 'package:flutter_planko/UI/widgets/home-widget/home_header.dart';
import 'package:flutter_planko/UI/widgets/home-widget/home_progress.dart';
import 'package:flutter_planko/UI/widgets/home-widget/home_posture.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(questByUserProvider.notifier).fetchQuestsByUser();
      ref.read(postureProvider.notifier).fetchPostures();
      ref.read(questCategoryProvider.notifier).fetchQuestCategories();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'PlankO',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 26),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, size: 28),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: const [
            HomeHeaderWidget(),
            SizedBox(height: 16),
            HomeProgressWidget(),
            SizedBox(height: 16),
            HomePostureWidget(),
            SizedBox(height: 32),
          ],
        ),
      ),
      bottomNavigationBar: Theme(
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
          currentIndex: 0,
          onTap: (index) {
            // Handle navigation when user clicks other tabs
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
      ),
    );
  }
}
