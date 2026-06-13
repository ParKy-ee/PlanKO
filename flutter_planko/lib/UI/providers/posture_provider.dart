import 'package:flutter/foundation.dart';
import 'package:flutter_planko/UI/providers/user_provider.dart';
import 'package:flutter_planko/data/models/posture.dart';
import 'package:flutter_planko/data/repositories/posture_repository_impl.dart';
import 'package:flutter_planko/data/source/remote/api-posture.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// --- Service & Repository Providers ---

final postureApiProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ApiPostureRemote(apiService: apiService);
});

final postureRepositoryProvider = Provider((ref) {
  final api = ref.watch(postureApiProvider);
  return PostureRepositoryImpl(api: api);
});

// --- UI State Provider ---

class PostureNotifier extends StateNotifier<List<PostureModel>> {
  final PostureRepositoryImpl repository;

  PostureNotifier({required this.repository}) : super([]);

  Future<void> fetchPostures() async {
    try {
      final postures = await repository.getPostures();
      state = postures;
    } catch (e) {
      debugPrint("Error fetching postures: $e");
    }
  }
}

final postureProvider =
    StateNotifierProvider<PostureNotifier, List<PostureModel>>((ref) {
      final repository = ref.watch(postureRepositoryProvider);
      return PostureNotifier(repository: repository);
    });
