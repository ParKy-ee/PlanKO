import 'package:flutter_planko/UI/providers/session_performance_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/mission_provider.dart';
import 'package:flutter/material.dart';

class HomeHeaderWidget extends ConsumerWidget {
  const HomeHeaderWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final missions = ref.watch(missionProvider);

    int totalTarget = 0;
    int totalCurrent = 0;
    for (var mission in missions) {
      totalCurrent += mission.current;
      totalTarget += mission.target;
    }

    final double progress = totalTarget > 0
        ? (totalCurrent / totalTarget)
        : 0.0;
    final int percentage = (progress * 100).round();
    final sessionPerformances = ref.watch(sessionPerformanceProvider);
    final totalKcal = sessionPerformances.fold<num>(
      0,
      (prev, element) => prev + (element.kcal ?? 0),
    );

    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.blue.shade500,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'จำนวน\nแคลอรี่\nที่เผาผลาญ\nรวม',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  height: 1.2,
                ),
              ),
              SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    totalKcal.toStringAsFixed(0),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      height: 1,
                    ),
                  ),
                  SizedBox(width: 4),
                  Text(
                    'แคล',
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                ],
              ),
            ],
          ),
          SizedBox(
            width: 100,
            height: 100,
            child: Stack(
              fit: StackFit.expand,
              children: [
                CircularProgressIndicator(
                  value: progress,
                  strokeWidth: 8,
                  backgroundColor: Colors.white.withOpacity(0.3),
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                ),
                Center(
                  child: Text(
                    '$percentage %',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
