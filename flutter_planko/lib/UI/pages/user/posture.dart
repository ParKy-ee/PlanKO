import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/posture_provider.dart';
import 'package:flutter_planko/data/models/posture.dart';
import 'package:flutter_planko/UI/widgets/navebar.dart';
import 'package:flutter_planko/UI/pages/user/posture-detail.dart';

class PosturePage extends ConsumerStatefulWidget {
  const PosturePage({super.key});

  @override
  ConsumerState<PosturePage> createState() => _PosturePageState();
}

class _PosturePageState extends ConsumerState<PosturePage> {
  int _selectedCategoryId = 0;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(postureProvider.notifier).fetchPostures();
    });
  }

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

    final filteredPostures = _selectedCategoryId == 0
        ? allPostures
        : allPostures
              .where((p) => p.postureCategory?.id == _selectedCategoryId)
              .toList();

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            expandedHeight: 120.0,
            floating: false,
            pinned: true,
            backgroundColor: Colors.white,
            elevation: 0,
            surfaceTintColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: false,
              titlePadding: const EdgeInsets.only(left: 16, bottom: 16),
              title: const Text(
                'ข้อมูลท่า Plank',
                style: TextStyle(
                  color: Colors.black87,
                  fontWeight: FontWeight.bold,
                  fontSize: 24,
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    _buildCategoryChip(0, 'ทั้งหมด'),
                    ...uniqueCategories.entries.map(
                      (e) => _buildCategoryChip(e.key, e.value),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: filteredPostures.isEmpty
                ? const SliverFillRemaining(
                    child: Center(child: Text('ไม่พบข้อมูลท่า')),
                  )
                : SliverList(
                    delegate: SliverChildBuilderDelegate((context, index) {
                      final posture = filteredPostures[index];
                      return _buildPostureCard(posture);
                    }, childCount: filteredPostures.length),
                  ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
      bottomNavigationBar: const SharedBottomNavBar(
        currentIndex: 2,
      ), // Assuming 2 for postures
    );
  }

  Widget _buildCategoryChip(int id, String label) {
    final isSelected = _selectedCategoryId == id;
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (selected) {
          setState(() {
            _selectedCategoryId = id;
          });
        },
        selectedColor: Colors.blue.shade100,
        backgroundColor: Colors.grey.shade100,
        checkmarkColor: Colors.blue.shade700,
        labelStyle: TextStyle(
          color: isSelected ? Colors.blue.shade800 : Colors.black54,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected ? Colors.blue.shade200 : Colors.transparent,
          ),
        ),
      ),
    );
  }

  Widget _buildPostureCard(PostureModel posture) {
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
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  width: 100,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.blue.shade400, Colors.blue.shade700],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Center(
                    child: Hero(
                      tag: 'posture-${posture.id}',
                      child: const Icon(
                        Icons.fitness_center,
                        color: Colors.white,
                        size: 40,
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                posture.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: Colors.black87,
                                ),
                              ),
                            ),
                            _buildDifficultyBadge(posture.difficulty),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          posture.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            // ครอบส่วนฝั่งซ้ายด้วย Expanded เพื่อให้แบ่งพื้นที่กับฝั่งขวา
                            Expanded(
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.star_rounded,
                                    size: 14,
                                    color: Colors.amber.shade700,
                                  ),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      posture.postureCategory?.name ?? 'ทั่วไป',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: Colors.amber.shade900,
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            // ส่วนฝั่งขวา (ดูรายละเอียด)
                            Text(
                              'ดูรายละเอียด',
                              style: TextStyle(
                                color: Colors.blue.shade700,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const Icon(
                              Icons.chevron_right,
                              size: 14,
                              color: Colors.blue,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDifficultyBadge(String difficulty) {
    Color color;
    String text;

    switch (difficulty.toLowerCase()) {
      case 'easy':
        color = Colors.green;
        text = 'ง่าย';
        break;
      case 'medium':
        color = Colors.orange;
        text = 'ปานกลาง';
        break;
      case 'hard':
        color = Colors.red;
        text = 'ยาก';
        break;
      default:
        color = Colors.grey;
        text = difficulty;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
