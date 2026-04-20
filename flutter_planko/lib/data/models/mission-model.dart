class MissionModel {
  final int id;
  final int user;
  final String status;
  final String startAt;
  final String endAt;
  final List<dynamic> missionByPrograms;
  final String createdAt;
  final String updatedAt;

  MissionModel({
    required this.id,
    required this.status,
    required this.startAt,
    required this.endAt,
    required this.user,
    required this.missionByPrograms,
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
          ? List<dynamic>.from(json['missionByPrograms']) 
          : [],
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
      'missionByPrograms': missionByPrograms.map((x) => x).toList(),
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
