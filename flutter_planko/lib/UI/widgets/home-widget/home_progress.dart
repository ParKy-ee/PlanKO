import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/quest_by_user_provider.dart';

class HomeProgressWidget extends ConsumerWidget {
  const HomeProgressWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quests = ref.watch(questByUserProvider);

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'การพัฒนา',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              TextButton(onPressed: () {}, child: const Text('ดูทั้งหมด')),
            ],
          ),
        ),
        SizedBox(
          height: 140,
          child: quests.isEmpty
              ? const Center(child: Text('ไม่มีข้อมูล'))
              : ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: quests.length,
                  itemBuilder: (context, index) {
                    final quest = quests[index];
                    final current = quest.currentValue.toDouble();
                    final target = quest.targetValue.toDouble();
                    final progress = target > 0 ? (current / target) : 0.0;

                    return Container(
                      width: 140,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.1),
                            blurRadius: 4,
                            spreadRadius: 1,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Align(
                            alignment: Alignment.topRight,
                            child: Icon(
                              Icons.more_vert,
                              size: 16,
                              color: Colors.grey.shade500,
                            ),
                          ),
                          SizedBox(
                            width: 60,
                            height: 60,
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                CircularProgressIndicator(
                                  value: progress,
                                  strokeWidth: 6,
                                  backgroundColor: Colors.grey.shade300,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    Colors.blue.shade500,
                                  ),
                                ),
                                Center(
                                  child: Text(
                                    '${quest.currentValue ?? 0}/${quest.targetValue ?? 0}',
                                    style: TextStyle(
                                      color: Colors.blue.shade600,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            '${quest.questName ?? "ไม่มีชื่อ"}',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
