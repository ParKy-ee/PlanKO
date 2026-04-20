class PlankPerformanceModel {
  final int id;
  final num accuracyAvg;
  final int perfectCount;
  final int goodCount;
  final int badCount;
  final int missedCount;
  final int score;
  final bool completed;
  final num kcal;
  final int duration;
  final String createdAt;
  final String updatedAt;
  final int plankSessionId;
  final int? userId;

  PlankPerformanceModel({
    required this.id,
    required this.accuracyAvg,
    required this.perfectCount,
    required this.goodCount,
    required this.badCount,
    required this.missedCount,
    required this.score,
    required this.completed,
    required this.kcal,
    required this.duration,
    required this.createdAt,
    required this.updatedAt,
    required this.plankSessionId,
    this.userId,
  });

  factory PlankPerformanceModel.fromJson(Map<String, dynamic> json) {
    return PlankPerformanceModel(
      id: json['id'] ?? 0,
      accuracyAvg: json['accuracy_avg'] ?? 0,
      perfectCount: json['perfect_count'] ?? 0,
      goodCount: json['good_count'] ?? 0,
      badCount: json['bad_count'] ?? 0,
      missedCount: json['missed_count'] ?? 0,
      score: json['score'] ?? 0,
      completed: json['completed'] ?? false,
      kcal: json['kcal'] ?? 0,
      duration: json['duration'] ?? 0,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
      plankSessionId: json['plankSession']?['id'] ?? 0,
      userId: json['user']?['id'],
    );
  }
}
