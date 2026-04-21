import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/UI/providers/mission_provider.dart';
import 'package:flutter_planko/UI/providers/session_performance_provider.dart';
import 'package:flutter_planko/UI/widgets/profile-widget/profile_header.dart';
import 'package:flutter_planko/UI/widgets/profile-widget/profile_stats.dart';
import 'package:flutter_planko/UI/widgets/profile-widget/profile_history.dart';
import 'package:flutter_planko/UI/widgets/navebar.dart';

class ProfilePage extends ConsumerStatefulWidget {
  const ProfilePage({super.key});

  @override
  ConsumerState<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends ConsumerState<ProfilePage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() async {
      try {
        final user = await ref.read(userDataProvider.future);
        ref
            .read(sessionPerformanceProvider.notifier)
            .fetchSessionPerformances(user.id);
        ref.read(missionProvider.notifier).fetchMissions(user.id.toString());
      } catch (e) {
        debugPrint('Error initializing profile data: $e');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final userAsync = ref.watch(userDataProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'โปรไฟล์',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w900,
            fontSize: 22,
          ),
        ),
        centerTitle: true,
      ),
      body: userAsync.when(
        data: (user) => SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                SizedBox(height: 16),
                ProfileHeaderWidget(),
                SizedBox(height: 32),
                ProfileStatsWidget(),
                SizedBox(height: 32),
                ProfileHistoryWidget(),
                SizedBox(height: 40),
              ],
            ),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
      bottomNavigationBar: const SharedBottomNavBar(currentIndex: 3),
    );
  }
}
