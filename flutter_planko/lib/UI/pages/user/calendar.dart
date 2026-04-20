import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/widgets/navebar.dart';

class CalendarPage extends StatefulWidget {
  const CalendarPage({super.key});

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ปฏิทิน')),
      body: const Center(child: Text('หน้าปฏิทิน')),
      bottomNavigationBar: const SharedBottomNavBar(currentIndex: 2),
    );
  }
}
