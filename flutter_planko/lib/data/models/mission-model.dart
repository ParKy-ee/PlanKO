class MissionModel {
  final int id;
  final int user;
  final String status;
  final String startAt;
  final String endAt;
  final List<MissionByProgramModel> missionByPrograms;
  final int target;
  final int current;
  final String createdAt;
  final String updatedAt;

  MissionModel({
    required this.id,
    required this.status,
    required this.startAt,
    required this.endAt,
    required this.user,
    required this.missionByPrograms,
    required this.target,
    required this.current,
    required this.createdAt,
    required this.updatedAt,
  });

  factory MissionModel.fromJson(Map<String, dynamic> json) {
    return MissionModel(
      id: json['id'] ?? 0,
      status: json['status'] ?? '',
      startAt: json['startAt'] ?? '',
      endAt: json['endAt'] ?? '',
      user: json['user'] ?? 0,
      missionByPrograms: json['missionByPrograms'] != null
          ? (json['missionByPrograms'] as List)
              .map((i) => MissionByProgramModel.fromJson(i))
              .toList()
          : [],
      target: json['target'] ?? 0,
      current: json['current'] ?? 0,
      createdAt: json['createdAt'] ?? '',
      updatedAt: json['updatedAt'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'status': status,
      'startAt': startAt,
      'endAt': endAt,
      'user': user,
      'missionByPrograms': missionByPrograms.map((x) => x.toJson()).toList(),
      'target': target,
      'current': current,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}

class MissionByProgramModel {
  final int id;
  final ProgramModel? program;

  MissionByProgramModel({
    required this.id,
    this.program,
  });

  factory MissionByProgramModel.fromJson(Map<String, dynamic> json) {
    return MissionByProgramModel(
      id: json['id'] ?? 0,
      program: json['program'] != null
          ? ProgramModel.fromJson(json['program'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'program': program?.toJson(),
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
