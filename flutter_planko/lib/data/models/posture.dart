class PostureCategory {
  final int id;
  final String name;
  final String description;
  final bool isActive;
  final String createdAt;
  final String updatedAt;

  PostureCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PostureCategory.fromJson(Map<String, dynamic> json) {
    return PostureCategory(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      isActive: json['is_active'] ?? true,
      createdAt: json['createdAt'] ?? '',
      updatedAt: json['updatedAt'] ?? '',
    );
  }
}

class PostureModel {
  final int id;
  final PostureCategory? postureCategory;
  final String difficulty;
  final String name;
  final String description;
  final bool isActive;
  final String createdAt;
  final String updatedAt;

  PostureModel({
    required this.id,
    this.postureCategory,
    required this.difficulty,
    required this.name,
    required this.description,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PostureModel.fromJson(Map<String, dynamic> json) {
    return PostureModel(
      id: json['id'],
      postureCategory: json['postureCategory'] != null
          ? PostureCategory.fromJson(json['postureCategory'])
          : null,
      difficulty: json['difficulty'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      isActive: json['is_active'] ?? true,
      createdAt: json['createdAt'] ?? '',
      updatedAt: json['updatedAt'] ?? '',
    );
  }
}
