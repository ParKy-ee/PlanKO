import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/models/user-model.dart';
import 'package:intl/intl.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userDataProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'โปรไฟล์',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        centerTitle: true,
      ),
      body: userAsync.when(
        data: (user) => _buildBody(context, ref, user),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
      bottomNavigationBar: _buildBottomNav(context),
    );
  }

  Widget _buildBody(BuildContext context, WidgetRef ref, UserModel user) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            _buildHeader(user),
            const SizedBox(height: 24),
            _buildStats(user),
            const SizedBox(height: 24),
            _buildHistoryHeader(context),
            const SizedBox(height: 12),
            _buildHistoryList(user),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(UserModel user) {
    final mission = user.missions.isNotEmpty ? user.missions.first : null;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 100,
          child: Column(
            children: [
              Container(
                width: 70,
                height: 70,
                decoration: const BoxDecoration(
                  color: Color(0xFFE8E0FF),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.person_outline,
                  size: 45,
                  color: Color(0xFF9C7AEE),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                user.name,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              Text(
                user.email,
                style: const TextStyle(
                  fontSize: 11,
                  color: Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF007AFF),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        mission?.target ?? 'แผนทั่วไป',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'สเตตัส : ${mission?.status ?? 'กำลังทำ'}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                        ),
                      ),
                      Text(
                        'เริ่มเมื่อ : ${mission?.startAt != null ? _formatDate(mission!.startAt) : '-'}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'ดำเนินไปแล้ว : 68 %',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  width: 55,
                  height: 55,
                  child: Stack(
                    children: [
                      Center(
                        child: SizedBox(
                          width: 45,
                          height: 45,
                          child: CircularProgressIndicator(
                            value: 0.68,
                            strokeWidth: 5,
                            backgroundColor: Colors.white.withOpacity(0.2),
                            valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStats(UserModel user) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        children: [
          Row(
            children: [
              _buildStatItem('ส่วนสูง : ${user.height} cm', Icons.person_add_alt_1_outlined),
              _buildStatItem('น้ำหนัก : ${user.weight} Kg', Icons.monitor_weight_outlined, showEdit: true),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              _buildStatItem('อายุ : ${user.age}', Icons.hourglass_bottom_outlined),
              _buildStatItem('เพศ : ${user.gender == 'male' ? 'ชาย' : 'หญิง'}', Icons.transgender_outlined),
            ],
          ),
        ],
      ),
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
                        style: const TextStyle(
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ],
                  ),
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                )
              else
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
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

  Widget _buildHistoryHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'ประวัติ',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        GestureDetector(
          onTap: () {},
          child: const Text(
            'ดูทั้งหมด',
            style: TextStyle(color: Colors.blue, fontSize: 13),
          ),
        ),
      ],
    );
  }

  Widget _buildHistoryList(UserModel user) {
    return Column(
      children: [
        _buildHistoryItem('แผนทั่วไป', '20 ท่า • 22 นาที', '28/02/26'),
        const SizedBox(height: 12),
        _buildHistoryItem('แผนทั่วไป', '20 ท่า • 22 นาที', '27/02/26'),
        const SizedBox(height: 12),
        _buildHistoryItem('แผนทั่วไป', '20 ท่า • 22 นาที', '26/02/26'),
      ],
    );
  }

  Widget _buildHistoryItem(String title, String subtitle, String date) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFDFF8FF),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            width: 70,
            height: 45,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                'https://via.placeholder.com/70x45?text=Exercise',
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => const Icon(Icons.fitness_center),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF3366FF),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  date,
                  style: const TextStyle(
                    fontSize: 10,
                    color: Colors.black54,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd/MM/yy').format(date);
    } catch (e) {
      return dateStr;
    }
  }

  Widget _buildBottomNav(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      backgroundColor: const Color(0xFF007AFF),
      selectedItemColor: Colors.white,
      unselectedItemColor: Colors.white.withOpacity(0.7),
      currentIndex: 3,
      showSelectedLabels: true,
      showUnselectedLabels: true,
      selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
      unselectedLabelStyle: const TextStyle(fontSize: 10),
      onTap: (index) {
        if (index == 0) Navigator.pushReplacementNamed(context, '/home');
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'โฮม'),
        BottomNavigationBarItem(icon: Icon(Icons.show_chart), label: 'กิจกรรม'),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), label: 'ปฏิทิน'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'โปรไฟล์'),
      ],
    );
  }
}
