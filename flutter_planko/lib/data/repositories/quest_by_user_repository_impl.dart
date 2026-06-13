import 'package:flutter_planko/data/source/remote/api-quest-by-user.dart';
import 'package:flutter_planko/data/models/quest-by-user-model.dart';

class QuestByUserRepositoryImpl {
  final ApiQuestByUserRemote api;

  QuestByUserRepositoryImpl({required this.api});

  Future<List<QuestByUserModel>> getQuestsByUser() async {
    return await api.getQuestsByUser();
  }
}
