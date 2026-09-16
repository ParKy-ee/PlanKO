class ProgramPlanModel {
  final int id;
  final ProgramModel program;
  final PlankSessionModel plankSession;
  final int order;
  final bool isActive;
  final String createdAt;
  final String updatedAt;

  ProgramPlanModel({
    required this.id,
    required this.program,
    required this.plankSession,
    required this.order,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ProgramPlanModel.fromJson(Map<String, dynamic> json) {
    return ProgramPlanModel(
      id: json['id'] ?? 0,
      program: ProgramModel.fromJson(json['program'] ?? {}),
      plankSession: PlankSessionModel.fromJson(json['plankSession'] ?? {}),
      order: json['order'] ?? 0,
      isActive: json['is_active'] ?? false,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'program': program.toJson(),
      'plankSession': plankSession.toJson(),
      'order': order,
      'is_active': isActive,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }
}

class ProgramModel {
  final int id;
  final String programName;
  final String programType;
  final int period;
  final int frequency;
  final List<int> workDays;
  final List<int> restDays;
  final bool isActive;
  final String createdAt;
  final String updatedAt;

  ProgramModel({
    required this.id,
    required this.programName,
    required this.programType,
    required this.period,
    required this.frequency,
    required this.workDays,
    required this.restDays,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ProgramModel.fromJson(Map<String, dynamic> json) {
    return ProgramModel(
      id: json['id'] ?? 0,
      programName: json['programName'] ?? '',
      programType: json['programType'] ?? '',
      period: json['period'] ?? 0,
      frequency: json['frequency'] ?? 0,
      workDays: json['workDays'] != null ? List<int>.from(json['workDays']) : [],
      restDays: json['restDays'] != null ? List<int>.from(json['restDays']) : [],
      isActive: json['is_active'] ?? false,
      createdAt: json['createdAt'] ?? '',
      updatedAt: json['updatedAt'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'programName': programName,
      'programType': programType,
      'period': period,
      'frequency': frequency,
      'workDays': workDays,
      'restDays': restDays,
      'is_active': isActive,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}

class PlankSessionModel {
  final int id;
  final String name;
  final String description;
  final int totalScore;
  final String createdAt;
  final String updatedAt;

  PlankSessionModel({
    required this.id,
    required this.name,
    required this.description,
    required this.totalScore,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PlankSessionModel.fromJson(Map<String, dynamic> json) {
    return PlankSessionModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      totalScore: json['total_score'] ?? 0,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'total_score': totalScore,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }
}
