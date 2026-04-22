import 'package:flutter/material.dart';
import 'package:flutter_planko/routes.dart';

class CustomPage extends StatefulWidget {
  const CustomPage({super.key});

  @override
  State<CustomPage> createState() => _CustomPageState();
}

class _CustomPageState extends State<CustomPage> {
  int _levelIndex = 2; // ทั่วไป
  int _timePerPosture = 30;
  int _restTime = 15;
  bool _showPreview = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFF007AFF),
        elevation: 0,
        title: const Text(
          'กำหนดเอง',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const SizedBox(height: 8),
            _buildSelector(
              label: 'ระดับ',
              value: 'ทั่วไป',
              subValue: 'ฝึกประจำวัน',
              showChevrons: true,
              selectedIndex: 2,
              totalSteps: 5,
            ),
            const SizedBox(height: 12),
            _buildSelector(
              label: 'เวลาต่อท่า',
              value: '$_timePerPosture วินาที',
              showChevrons: false,
              selectedIndex: 0,
              totalSteps: 5,
              hasRightArrow: true,
            ),
            const SizedBox(height: 12),
            _buildSelector(
              label: 'เวลาพัก',
              value: '$_restTime วินาที',
              showChevrons: false,
              selectedIndex: 0,
              totalSteps: 5,
              hasRightArrow: true,
            ),
            const SizedBox(height: 12),
            _buildToggleSelector(
              label: 'แสดงตัวอย่างท่าทาง',
              isOn: _showPreview,
              onChanged: (val) => setState(() => _showPreview = val),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: 280,
              height: 48,
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF007AFF),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'เริ่ม',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSelector({
    required String label,
    required String value,
    String? subValue,
    bool showChevrons = false,
    bool hasRightArrow = false,
    int selectedIndex = 0,
    int totalSteps = 5,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFD9D9D9),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              label,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          if (showChevrons)
            const Icon(Icons.chevron_left, color: Colors.black, size: 32),
          Expanded(
            flex: 6,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 8),
              padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        value,
                        style: const TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w500),
                      ),
                      if (subValue != null) ...[
                        const Spacer(),
                        Text(
                          subValue,
                          style:
                              const TextStyle(fontSize: 10, color: Colors.grey),
                        ),
                      ]
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: List.generate(totalSteps, (index) {
                      return Container(
                        width: 30,
                        height: 4,
                        decoration: BoxDecoration(
                          color: index == selectedIndex
                              ? const Color(0xFF007AFF)
                              : const Color(0xFFE0E0E0),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      );
                    }),
                  )
                ],
              ),
            ),
          ),
          if (showChevrons || hasRightArrow)
            const Icon(Icons.chevron_right, color: Colors.black, size: 32),
        ],
      ),
    );
  }

  Widget _buildToggleSelector({
    required String label,
    required bool isOn,
    required Function(bool) onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFD9D9D9),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              label,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            flex: 4,
            child: Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => onChanged(true),
                    child: Container(
                      height: 36,
                      decoration: BoxDecoration(
                        color: isOn ? const Color(0xFF007AFF) : Colors.white,
                        borderRadius: const BorderRadius.horizontal(
                            left: Radius.circular(8)),
                      ),
                      child: Center(
                        child: Text(
                          'แสดง',
                          style: TextStyle(
                            color: isOn ? Colors.white : Colors.black,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: GestureDetector(
                    onTap: () => onChanged(false),
                    child: Container(
                      height: 36,
                      decoration: BoxDecoration(
                        color: !isOn ? const Color(0xFF007AFF) : Colors.white,
                        borderRadius: const BorderRadius.horizontal(
                            right: Radius.circular(8)),
                      ),
                      child: Center(
                        child: Text(
                          'ไม่แสดง',
                          style: TextStyle(
                            color: !isOn ? Colors.white : Colors.black,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
