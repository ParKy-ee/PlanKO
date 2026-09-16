class QuestCategoryModel {
  final int id;
  final String name;
  final String description;
  final bool isActive;
  final String createdAt;
  final String updatedAt;

  QuestCategoryModel({
    required this.id,
    required this.name,
    required this.description,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory QuestCategoryModel.fromJson(Map<String, dynamic> json) {
    return QuestCategoryModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      isActive: json['is_active'] ?? true,
      createdAt: json['createdAt'] ?? '',
      updatedAt: json['updatedAt'] ?? '',
    );
  }
}
