import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/widgets/navebar.dart';

class ActivityPage extends StatefulWidget {
  const ActivityPage({super.key});

  @override
  State<ActivityPage> createState() => _ActivityPageState();
}

class _ActivityPageState extends State<ActivityPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Activity')),
      body: Center(child: Text('Activity Page')),
      bottomNavigationBar: const SharedBottomNavBar(currentIndex: 1),
    );
  }
}
