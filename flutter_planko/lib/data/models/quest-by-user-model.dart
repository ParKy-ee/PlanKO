class QuestByUserModel {
  final int id;
  final int userId;
  final int questId;
  final String questName;
  final num currentValue;
  final num targetValue;
  final String status;
  final String? completedAt;
  final String createdAt;
  final String updatedAt;

  QuestByUserModel({
    required this.id,
    required this.userId,
    required this.questId,
    required this.questName,
    required this.currentValue,
    required this.targetValue,
    required this.status,
    this.completedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory QuestByUserModel.fromJson(Map<String, dynamic> json) {
    return QuestByUserModel(
      id: json['id'] ?? 0,
      userId: json['user']?['id'] ?? 0,
      questId: json['quest']?['id'] ?? 0,
      questName: json['quest']?['name'] ?? 'ไม่มีชื่อ',
      currentValue: json['current_value'] ?? 0,
      targetValue: json['target_value'] ?? 0,
      status: json['status'] ?? 'PENDING',
      completedAt: json['completed_at'],
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}
