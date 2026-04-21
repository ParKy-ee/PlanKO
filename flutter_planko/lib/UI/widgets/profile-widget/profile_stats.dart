import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';

class ProfileStatsWidget extends ConsumerWidget {
  const ProfileStatsWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userDataProvider);

    return userAsync.when(
      data: (user) {
        return Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            children: [
              Row(
                children: [
                  _buildStatItem(
                    'ส่วนสูง : ${user.height} cm',
                    Icons.person_add_alt_1_outlined,
                  ),
                  _buildStatItem(
                    'น้ำหนัก : ${user.weight} Kg',
                    Icons.monitor_weight_outlined,
                    showEdit: true,
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  _buildStatItem(
                    'อายุ : ${user.age}',
                    Icons.hourglass_bottom_outlined,
                  ),
                  _buildStatItem(
                    'เพศ : ${user.gender == 'male' ? 'ชาย' : 'หญิง'}',
                    Icons.transgender_outlined,
                  ),
                ],
              ),
            ],
          ),
        );
      },
      loading: () => const SizedBox(
        height: 150,
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (err, stack) => Center(child: Text('Error: $err')),
    );
  }

  Widget _buildStatItem(String label, IconData icon, {bool showEdit = false}) {
    return Expanded(
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          Column(
            children: [
              Icon(icon, size: 48, color: Colors.black87),
              const SizedBox(height: 8),
              if (showEdit)
                Text.rich(
                  TextSpan(
                    text: label.split(':')[0] + ' : ',
                    children: [
                      TextSpan(
                        text: label.split(':')[1].trim(),
                        style: const TextStyle(decoration: TextDecoration.none),
                      ),
                    ],
                  ),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    decoration: TextDecoration.none,
                  ),
                )
              else
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    decoration: TextDecoration.none,
                  ),
                ),
            ],
          ),
          if (showEdit)
            Positioned(
              top: -8,
              right: 12,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(
                  color: Color(0xFFFFD700),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.edit, size: 14, color: Colors.black),
              ),
            ),
        ],
      ),
    );
  }
}
