class APIBase {
  static const String baseUrl = "http://localhost:3001/api/v1/";
}

class AuthApi {
  static const String login = "${APIBase.baseUrl}auth/login";
  static const String register = "${APIBase.baseUrl}register";
  static const String logout = "${APIBase.baseUrl}logout";
}

class MissionApi {
  static const String base = "${APIBase.baseUrl}mission";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class UserApi {
  static const String base = "${APIBase.baseUrl}user";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class ProgramApi {
  static const String base = "${APIBase.baseUrl}program";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class PlankSessionApi {
  static const String base = "${APIBase.baseUrl}plank-session";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class SessionPeraformanceApi {
  static const String base = "${APIBase.baseUrl}session-performance";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class PostureApi {
  static const String base = "${APIBase.baseUrl}posture";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class QuestApi {
  static const String base = "${APIBase.baseUrl}/quest";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class QuestCategoryApi {
  static const String base = "${APIBase.baseUrl}/quest-category";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class PlankBySessionApi {
  static const String base = "${APIBase.baseUrl}/plank-by-session";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class PostureCategoryApi {
  static const String base = "${APIBase.baseUrl}/posture-category";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}

class ProgramPlanApi {
  static const String base = "${APIBase.baseUrl}/program-plan";

  static String getById(String id) => "$base/$id";
  static String update(String id) => "$base/$id";
  static String delete(String id) => "$base/$id";
}
