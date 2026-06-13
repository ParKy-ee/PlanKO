import 'package:flutter/material.dart';
import 'package:flutter_planko/UI/pages/user/mission.dart';
import 'package:flutter_planko/data/models/user-model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/services/api-user-update.dart';

class UserDetailForm extends ConsumerStatefulWidget {
  const UserDetailForm({super.key});

  @override
  ConsumerState<UserDetailForm> createState() => _UserDetailFormState();
}

class _UserDetailFormState extends ConsumerState<UserDetailForm> {
  final TextEditingController _weightController = TextEditingController();
  final TextEditingController _heightController = TextEditingController();
  final TextEditingController _ageController = TextEditingController();
  String? _selectedGender;
  bool _isLoading = false;

  @override
  void dispose() {
    _weightController.dispose();
    _heightController.dispose();
    _ageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final userAsync = ref.watch(userDataProvider);

    return userAsync.when(
      data: (user) {
        // Populate controllers if they are empty (initial load)
        if (_weightController.text.isEmpty && user.weight > 0) {
          _weightController.text = user.weight.toString();
        }
        if (_heightController.text.isEmpty && user.height > 0) {
          _heightController.text = user.height.toString();
        }
        if (_ageController.text.isEmpty && user.age > 0) {
          _ageController.text = user.age.toString();
        }
        if (_selectedGender == null && user.gender.isNotEmpty) {
          _selectedGender = user.gender;
        }

        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF0084FF),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildInputLabel('น้ำหนัก :'),
                  const SizedBox(height: 8),
                  _buildTextField(_weightController, 'กรอก น้ำหนัก'),
                  const SizedBox(height: 20),
                  _buildInputLabel('ส่วนสูง :'),
                  const SizedBox(height: 8),
                  _buildTextField(_heightController, 'กรอก ส่วนสูง'),
                  const SizedBox(height: 20),
                  _buildInputLabel('อายุ :'),
                  const SizedBox(height: 8),
                  _buildTextField(_ageController, 'กรอก อายุ'),
                  const SizedBox(height: 20),
                  _buildInputLabel('เพศ :'),
                  const SizedBox(height: 8),
                  _buildGenderDropdown(),
                ],
              ),
            ),
            const SizedBox(height: 60),
            SizedBox(
              width: 250,
              height: 60,
              child: ElevatedButton(
                onPressed: _isLoading ? null : () => _handleSave(user),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0084FF),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  elevation: 0,
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'ต่อไป',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
              ),
            ),
          ],
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(
        child: Text(
          'เกิดข้อผิดพลาดในการโหลดข้อมูล: $err',
          style: const TextStyle(color: Colors.red),
        ),
      ),
    );
  }

  Future<void> _handleSave(UserModel user) async {
    setState(() => _isLoading = true);

    try {
      final apiService = ref.read(apiServiceProvider);
      final userDetailApi = UserDetailApi(apiService: apiService);

      final data = {
        'weight': int.tryParse(_weightController.text) ?? 0,
        'height': int.tryParse(_heightController.text) ?? 0,
        'age': int.tryParse(_ageController.text) ?? 0,
        'gender': _selectedGender ?? 'Other',
      };

      final updatedUser = await userDetailApi.updateUserDetail(
        user.id.toString(),
        data,
      );

      if (updatedUser != null) {
        await ref.read(userLocalProvider).saveUser(updatedUser);

        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('บันทึกข้อมูลเรียบร้อยแล้ว')),
        );
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const MissionPage()),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('เกิดข้อผิดพลาด: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Widget _buildInputLabel(String label) {
    return Text(
      label,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint) {
    return TextField(
      controller: controller,
      keyboardType: TextInputType.number,
      style: const TextStyle(color: Colors.black87),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
        filled: true,
        fillColor: const Color(0xFFF0F9FF),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildGenderDropdown() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F9FF),
        borderRadius: BorderRadius.circular(12),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedGender,
          isExpanded: true,
          hint: Text(
            'เลือก เพศ',
            style: TextStyle(color: Colors.grey.shade400, fontSize: 14),
          ),
          items: ['ผู้ชาย', 'ผู้หญิง', 'อื่นๆ'].map((String value) {
            return DropdownMenuItem<String>(value: value, child: Text(value));
          }).toList(),
          onChanged: (newValue) => setState(() => _selectedGender = newValue),
        ),
      ),
    );
  }
}
