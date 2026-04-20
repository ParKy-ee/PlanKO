import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/widgets/mission-widget/mission-header.dart';
import 'package:flutter_planko/UI/widgets/mission-widget/mission-list.dart';

class MissionPage extends StatelessWidget {
  const MissionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: const SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              MissionHeader(),
              SizedBox(height: 40),
              MissionList(),
            ],
          ),
        ),
      ),
    );
  }
}
