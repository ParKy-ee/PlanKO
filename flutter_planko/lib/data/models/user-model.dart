class UserModel {
  final int id;
  final String name;
  final String email;
  final String password;
  final bool isActive;
  final String role;
  final int weight;
  final int height;
  final int age;
  final String gender;
  final String createdAt;
  final String updatedAt;
  final List<MissionModel> missions;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.password,
    required this.isActive,
    required this.role,
    required this.weight,
    required this.height,
    required this.age,
    required this.gender,
    required this.createdAt,
    required this.updatedAt,
    required this.missions,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      password: json['password'] ?? '',
      isActive: json['isActive'] ?? true,
      role: json['role'] ?? 'user',
      weight: json['weight'] ?? 0,
      height: json['height'] ?? 0,
      age: json['age'] ?? 0,
      gender: json['gender'] ?? '',
      createdAt: json['createdAt'] ?? '',
      updatedAt: json['updatedAt'] ?? '',
      missions: (json['missions'] as List? ?? [])
          .map((m) => MissionModel.fromJson(m is Map ? Map<String, dynamic>.from(m) : {}))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'password': password,
      'isActive': isActive,
      'role': role,
      'weight': weight,
      'height': height,
      'age': age,
      'gender': gender,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'missions': missions.map((m) => m.toJson()).toList(),
    };
  }
}

class MissionModel {
  final int id;
  final String target;
  final String startAt;
  final String endAt;
  final String status;
  final String createdAt;
  final String updatedAt;

  MissionModel({
    required this.id,
    required this.target,
    required this.startAt,
    required this.endAt,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory MissionModel.fromJson(Map<String, dynamic> json) {
    return MissionModel(
      id: json['id'] ?? 0,
      target: json['target'] ?? '',
      startAt: json['startAt'] ?? '',
      endAt: json['endAt'] ?? '',
      status: json['status'] ?? '',
      createdAt: json['createdAt'] ?? '',
      updatedAt: json['updatedAt'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'target': target,
      'startAt': startAt,
      'endAt': endAt,
      'status': status,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
