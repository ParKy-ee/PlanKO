class DashboardModel {
  final Overview overview;
  final List<Development> developments;
  final List<PostureItem> postures;

  DashboardModel({
    required this.overview,
    required this.developments,
    required this.postures,
  });

  factory DashboardModel.fromJson(Map<String, dynamic> json) {
    return DashboardModel(
      overview: Overview.fromJson(json['overview'] ?? {}),
      developments: (json['developments'] as List<dynamic>?)
              ?.map((e) => Development.fromJson(e))
              .toList() ??
          [],
      postures: (json['postures'] as List<dynamic>?)
              ?.map((e) => PostureItem.fromJson(e))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'overview': overview.toJson(),
      'developments': developments.map((e) => e.toJson()).toList(),
      'postures': postures.map((e) => e.toJson()).toList(),
    };
  }
}

class Overview {
  final num totalCaloriesBurned;
  final num calorieProgressPercent;

  Overview({
    required this.totalCaloriesBurned,
    required this.calorieProgressPercent,
  });

  factory Overview.fromJson(Map<String, dynamic> json) {
    return Overview(
      totalCaloriesBurned: json['totalCaloriesBurned'] ?? 0,
      calorieProgressPercent: json['calorieProgressPercent'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalCaloriesBurned': totalCaloriesBurned,
      'calorieProgressPercent': calorieProgressPercent,
    };
  }
}

class Development {
  final int id;
  final String name;
  final int current;
  final int target;

  Development({
    required this.id,
    required this.name,
    required this.current,
    required this.target,
  });

  factory Development.fromJson(Map<String, dynamic> json) {
    return Development(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      current: json['current'] ?? 0,
      target: json['target'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'current': current,
      'target': target,
    };
  }
}

class PostureItem {
  final int id;
  final String name;
  final String description;
  final String category;
  final String imageUrl;

  PostureItem({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.imageUrl,
  });

  factory PostureItem.fromJson(Map<String, dynamic> json) {
    return PostureItem(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'category': category,
      'imageUrl': imageUrl,
    };
  }
}
