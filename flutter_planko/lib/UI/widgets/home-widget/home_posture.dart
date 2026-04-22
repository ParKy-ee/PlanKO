import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/posture_provider.dart';
import 'package:flutter_planko/routes.dart';
import 'package:flutter_planko/UI/pages/user/posture-detail.dart';

class HomePostureWidget extends ConsumerStatefulWidget {
  const HomePostureWidget({super.key});

  @override
  ConsumerState<HomePostureWidget> createState() => _HomePostureWidgetState();
}

class _HomePostureWidgetState extends ConsumerState<HomePostureWidget> {
  int _selectedCategoryId = 0;

  @override
  Widget build(BuildContext context) {
    final allPostures = ref.watch(postureProvider);

    // Dynamic extraction of categories from postures
    final uniqueCategories = <int, String>{};
    for (var p in allPostures) {
      if (p.postureCategory != null) {
        uniqueCategories[p.postureCategory!.id] = p.postureCategory!.name;
      }
    }

    // Filter postures based on selected category id
    final filteredPostures = _selectedCategoryId == 0
        ? allPostures
        : allPostures
              .where((p) => p.postureCategory?.id == _selectedCategoryId)
              .toList();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'ข้อมูลท่า',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () =>
                    Navigator.pushNamed(context, AppRoutes.posture),
                child: const Text('ดูทั้งหมด'),
              ),
            ],
          ),
        ),

        // Category Pills
        SizedBox(
          height: 40,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            children: [
              _buildPill(0, 'ทั้งหมด'),
              ...uniqueCategories.entries
                  .map((e) => _buildPill(e.key, e.value))
                  .toList(),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Posture Cards
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: filteredPostures.length > 5 ? 5 : filteredPostures.length,
          itemBuilder: (context, index) {
            final posture = filteredPostures[index];
            return GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PostureDetailPage(posture: posture),
                  ),
                );
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.cyan.shade50,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Hero(
                        tag: 'posture-${posture.id}',
                        child: Icon(
                          Icons.fitness_center,
                          color: Colors.cyan.shade700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            posture.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            posture.description,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade700,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            'จุดเด่น: ${posture.benefit}',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey.shade600,
                              fontStyle: FontStyle.italic,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                PostureDetailPage(posture: posture),
                          ),
                        );
                      },
                      icon: Icon(
                        Icons.chevron_right,
                        color: Colors.cyan.shade700,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildPill(int id, String label) {
    final isSelected = _selectedCategoryId == id;
    return GestureDetector(
      onTap: () => setState(() => _selectedCategoryId = id),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.transparent,
          border: Border.all(
            color: isSelected ? Colors.blue.shade400 : Colors.grey.shade300,
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.blue.shade500 : Colors.grey.shade600,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }
}
