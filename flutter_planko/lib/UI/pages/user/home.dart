import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/quest_by_user_provider.dart';
import 'package:flutter_planko/UI/providers/mission_provider.dart';
import 'package:flutter_planko/UI/providers/posture_provider.dart';
import 'package:flutter_planko/UI/providers/quest_category_provider.dart';
import 'package:flutter_planko/UI/providers/session_performance_provider.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/UI/widgets/home-widget/home_header.dart';
import 'package:flutter_planko/UI/widgets/home-widget/home_progress.dart';
import 'package:flutter_planko/UI/widgets/home-widget/home_posture.dart';
import 'package:flutter_planko/UI/widgets/navebar.dart';
import 'package:flutter_planko/routes.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() async {
      final user = await ref.read(userDataProvider.future);
      ref
          .read(sessionPerformanceProvider.notifier)
          .fetchSessionPerformances(user.id);

      ref.read(questByUserProvider.notifier).fetchQuestsByUser();
      ref.read(missionProvider.notifier).fetchMissions(user.id.toString());
      ref.read(postureProvider.notifier).fetchPostures();
      ref.read(questCategoryProvider.notifier).fetchQuestCategories();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            pinned: true,
            floating: true,
            backgroundColor: Colors.white,
            surfaceTintColor: Colors.transparent,
            elevation: 0,
            title: const Text(
              'PlankO',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 28,
                letterSpacing: -0.5,
                color: Colors.black87,
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 16),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.grey.shade100,
                ),
                child: IconButton(
                  icon: const Icon(
                    Icons.notifications_none_rounded,
                    size: 26,
                    color: Colors.black87,
                  ),
                  onPressed: () {},
                ),
              ),
            ],
          ),
          SliverPadding(
            padding: const EdgeInsets.only(top: 8, bottom: 40),
            sliver: SliverList(
              delegate: SliverChildListDelegate(const [
                HomeHeaderWidget(),
                SizedBox(height: 24),
                HomeProgressWidget(),
                SizedBox(height: 24),
                HomePostureWidget(),
              ]),
            ),
          ),
        ],
      ),
      bottomNavigationBar: const SharedBottomNavBar(currentIndex: 0),
    );
  }
}
