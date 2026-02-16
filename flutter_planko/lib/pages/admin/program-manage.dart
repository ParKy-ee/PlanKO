import 'package:flutter/material.dart';
import 'package:flutter_planko/services/api/client.dart';

class ProgramManagePage extends StatefulWidget {
  const ProgramManagePage({super.key});

  @override
  State<ProgramManagePage> createState() => _ProgramManagePageState();
}

class _ProgramManagePageState extends State<ProgramManagePage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _programName = TextEditingController();
  final TextEditingController _programType = TextEditingController();
  final TextEditingController _period = TextEditingController();
  final TextEditingController _frequency = TextEditingController();
  final TextEditingController _rest = TextEditingController();
  List<int> postureId = [];
  List<dynamic> posture = [];
  final Set<int> _selectedPostures = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _getPosture();
  }

  final Set<String> _selectedWorkDays = {};

  final List<String> days = ['0', '1', '2', '3', '4', '5', '6'];

  void _toggleDay(String day) {
    final isAdding = !_selectedWorkDays.contains(day);

    if (isAdding) {
      final freqText = _frequency.text.trim();
      if (freqText.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please enter Frequency first')),
        );
        return;
      }

      final frequency = int.tryParse(freqText);
      if (frequency == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Frequency must be a valid number')),
        );
        return;
      }

      if (_selectedWorkDays.length >= frequency) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('You can only select $frequency days')),
        );
        return;
      }
    }

    setState(() {
      if (_selectedWorkDays.contains(day)) {
        _selectedWorkDays.remove(day);
      } else {
        _selectedWorkDays.add(day);
      }
    });
  }

  Future<void> _getPosture() async {
    try {
      final response = await Client().getPosture();
      if (mounted) {
        setState(() {
          posture = response['data'];
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading postures: $e')));
      }
    }
  }

  Future<void> _createProgram() async {
    if (_formKey.currentState!.validate()) {
      try {
        for (int id in postureId) {
          final response = await Client().createProgram({
            'programName': _programName.text,
            'programType': _programType.text,
            'period': int.parse(_period.text),
            'frequency': int.parse(_frequency.text),
            'workDays': _selectedWorkDays.map(int.parse).toList(),
            'restDays': days
                .where((day) => !_selectedWorkDays.contains(day))
                .map(int.parse)
                .toList(),
            'postureId': id,
            'rest': int.tryParse(_rest.text) ?? 0,
          });
          if (!response['success']) {
            throw Exception('Failed to create program for posture $id');
          }
        }
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Programs created successfully')),
          );
          Navigator.pop(context);
        }
      } catch (e) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    }
  }

  String _getDayLabel(String day) {
    return switch (day) {
      '0' => 'Mon',
      '1' => 'Tue',
      '2' => 'Wed',
      '3' => 'Thu',
      '4' => 'Fri',
      '5' => 'Sat',
      '6' => 'Sun',
      _ => '',
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Program Management'), elevation: 0),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildSectionTitle('Program Details'),
              const SizedBox(height: 16),
              _buildTextField(
                controller: _programName,
                label: 'Program Name',
                icon: Icons.fitness_center,
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter a name'
                    : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                decoration: _inputDecoration('Program Type', Icons.category),
                value: _programType.text.isNotEmpty ? _programType.text : null,
                items: const [
                  DropdownMenuItem(
                    value: 'Weightloss',
                    child: Text('Weight Loss'),
                  ),
                  DropdownMenuItem(
                    value: 'Weightgain',
                    child: Text('Weight Gain'),
                  ),
                  DropdownMenuItem(
                    value: 'Maintenance',
                    child: Text('Maintenance'),
                  ),
                ],
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _programType.text = value;
                    });
                  }
                },
                validator: (value) =>
                    value == null ? 'Please select a type' : null,
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Schedule Configuration'),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: _buildTextField(
                      controller: _period,
                      label: 'Period (Weeks)',
                      icon: Icons.calendar_today,
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildTextField(
                      controller: _frequency,
                      label: 'Frequency (times/week)',
                      icon: Icons.repeat,
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildTextField(
                      controller: _rest,
                      label: 'Rest (sec)',
                      icon: Icons.timer,
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              _buildSectionTitle('Work Days'),
              const SizedBox(height: 8),
              const Text(
                'Select the days assigned for workouts:',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 12),
              // Days of the week
              Wrap(
                spacing: 8.0,
                runSpacing: 8.0,
                children: days.map((day) {
                  final isSelected = _selectedWorkDays.contains(day);
                  return FilterChip(
                    label: Text(_getDayLabel(day)),
                    selected: isSelected,
                    onSelected: (_) => _toggleDay(day),
                    showCheckmark: false,
                    selectedColor: Theme.of(context).primaryColor,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : Colors.black87,
                      fontWeight: isSelected
                          ? FontWeight.bold
                          : FontWeight.normal,
                    ),
                    backgroundColor: Colors.grey.shade100,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected
                            ? Colors.transparent
                            : Colors.grey.shade300,
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 40),
              _buildSectionTitle('Select Postures'),
              const SizedBox(height: 8),
              const Text(
                'Choose the exercises to include in this program:',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 12),
              // Postures
              _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : Wrap(
                      spacing: 8.0,
                      runSpacing: 8.0,
                      children: posture.map((postureItem) {
                        final bool isSelected = _selectedPostures.contains(
                          postureItem['id'],
                        );
                        return FilterChip(
                          label: Text(postureItem['postureName']),
                          selected: isSelected,
                          onSelected: (bool value) {
                            setState(() {
                              if (value) {
                                _selectedPostures.add(postureItem['id']);
                                postureId.add(postureItem['id']);
                              } else {
                                _selectedPostures.remove(postureItem['id']);
                                postureId.remove(postureItem['id']);
                              }
                            });
                          },
                          showCheckmark: false,
                          selectedColor: Theme.of(context).primaryColor,
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : Colors.black87,
                            fontWeight: isSelected
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                          backgroundColor: Colors.grey.shade100,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected
                                  ? Colors.transparent
                                  : Colors.grey.shade300,
                            ),
                          ),
                          avatar: isSelected
                              ? const Icon(
                                  Icons.check,
                                  size: 18,
                                  color: Colors.white,
                                )
                              : null,
                        );
                      }).toList(),
                    ),
              const SizedBox(height: 32),
              SizedBox(
                height: 52,
                child: ElevatedButton(
                  onPressed: _createProgram,
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 2,
                  ),
                  child: const Text(
                    'Create Program',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, color: Colors.grey.shade600),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Theme.of(context).primaryColor, width: 2),
      ),
      filled: true,
      fillColor: Colors.grey.shade50,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      decoration: _inputDecoration(label, icon),
      keyboardType: keyboardType,
      validator: validator,
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: Colors.black87,
      ),
    );
  }
}
