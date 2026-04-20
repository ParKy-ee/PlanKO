class ProgramModel {
  final int id;
  final String programName;
  final String programType;
  final int period;
  final int frequency;
  final List<int> workDay;
  final List<int> restDays;
  final bool is_active;
  final String createdAt;
  final String updatedAt;

  ProgramModel({
    required this.id,
    required this.programName,
    required this.programType,
    required this.period,
    required this.frequency,
    required this.workDay,
    required this.restDays,
    required this.is_active,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ProgramModel.fromJson(Map<String, dynamic> json) {
    return ProgramModel(
      id: json['id'] ?? 0,
      programName: json['programName'] ?? json['program_name'] ?? '',
      programType: json['programType'] ?? json['program_type'] ?? '',
      period: json['period'] ?? 0,
      frequency: json['frequency'] ?? 0,
      workDay: List<int>.from(json['workDays'] ?? json['work_day'] ?? []),
      restDays: List<int>.from(json['restDays'] ?? json['rest_days'] ?? []),
      is_active: json['is_active'] ?? false,
      createdAt: json['createdAt'] ?? json['created_at'] ?? '',
      updatedAt: json['updatedAt'] ?? json['updated_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'program_name': programName,
      'program_type': programType,
      'period': period,
      'frequency': frequency,
      'work_day': workDay,
      'rest_days': restDays,
      'is_active': is_active,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
