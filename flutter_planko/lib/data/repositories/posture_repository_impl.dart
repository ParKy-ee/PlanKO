import 'package:flutter_planko/data/source/remote/api-posture.dart';
import 'package:flutter_planko/data/models/posture.dart';

class PostureRepositoryImpl {
  final ApiPostureRemote api;

  PostureRepositoryImpl({required this.api});

  Future<List<PostureModel>> getPostures() async {
    return await api.getPostures();
  }
}
