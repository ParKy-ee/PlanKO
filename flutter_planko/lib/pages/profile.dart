import 'package:flutter/material.dart';
import 'package:flutter_planko/components/profile/Additional-Op.dart';
import 'package:flutter_planko/components/profile/State-Section.dart';
import 'package:flutter_planko/components/profile/buid-heaer.dart';
import 'package:flutter_planko/components/profile/build-info.dart';
import 'package:flutter_planko/database/db_helper.dart';
import 'package:flutter_planko/services/api/client.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final Client client = Client();
  Map<String, dynamic>? profile;
  Map<String, dynamic>? localUser;
  bool isLoading = true;
  String error = '';

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final response = await client.getProfile();
      final user = await DatabaseHelper.instance.getUser();

      if (!mounted) return;

      setState(() {
        if (response['data'] != null) {
          profile = Map<String, dynamic>.from(response['data']);
        }
        localUser = user.isNotEmpty
            ? Map<String, dynamic>.from(user.first)
            : null;
        isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        error = e.toString();
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (error.isNotEmpty) {
      return Scaffold(body: Center(child: Text('Error: $error')));
    }

    return Scaffold(
      backgroundColor: Colors.grey[50],
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text(
          'Profile',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            buildHeader(),
            const SizedBox(height: 50),
            buildUserInfo(profile),
            const SizedBox(height: 30),
            buildStatsSection(localUser),
            const SizedBox(height: 30),
            buildAdditionalOptions(context),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
