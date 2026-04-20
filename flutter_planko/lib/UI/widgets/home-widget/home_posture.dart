import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/posture_provider.dart';
import 'package:flutter_planko/UI/providers/quest_category_provider.dart';

class HomePostureWidget extends ConsumerStatefulWidget {
  const HomePostureWidget({super.key});

  @override
  ConsumerState<HomePostureWidget> createState() => _HomePostureWidgetState();
}

class _HomePostureWidgetState extends ConsumerState<HomePostureWidget> {
  int _selectedCategoryId = 0;

  @override
  Widget build(BuildContext context) {
    final categories = ref.watch(questCategoryProvider);
    final allPostures = ref.watch(postureProvider);

    // Filter postures based on selected category object id
    final postures = _selectedCategoryId == 0 
        ? allPostures 
        : allPostures.where((p) => p.postureCategory?.id == _selectedCategoryId).toList();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('ข้อมูลท่า', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              TextButton(onPressed: () {}, child: const Text('ดูทั้งหมด')),
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
              ...categories.map((c) => _buildPill(c.id, c.name)).toList(),
            ],
          ),
        ),
        
        const SizedBox(height: 16),
        
        // Posture Cards
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: postures.length,
          itemBuilder: (context, index) {
            final posture = postures[index];
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.cyan.shade50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    width: 80,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade200, // Placeholder
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.fitness_center, color: Colors.blueGrey),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(posture.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 4),
                        Text(
                          'ประโยชน์ : ${posture.description}',
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade500,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                    ),
                    child: const Text('ดูรายละเอียด', style: TextStyle(fontSize: 12)),
                  )
                ],
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
          border: Border.all(color: isSelected ? Colors.blue.shade400 : Colors.grey.shade300),
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
