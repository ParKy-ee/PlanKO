import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { MissionModule } from "./mission/mission.module";
import { ProgramModule } from "./program/program.module";
import { MissionByProgramModule } from "./mission-by-program/mission-by-program.module";
import { PlankSessionModule } from "./plank-session/plank-session.module";
import { SeesionPerfomanceModule } from "./seesion-perfomance/seesion-perfomance.module";
import { PostureModule } from "./posture/posture.module";
import { PostureByProgramModule } from "./posture-by-program/posture-by-program.module";
import { QuestCategoryModule } from "./quest-category/quest-category.module";
import { QuestModule } from "./quest/quest.module";
import { QuestByUesrModule } from "./quest-by-uesr/quest-by-uesr.module";
import { PostureCategoryModule } from "./posture-category/posture-category.module";
import { SensorSocketModule } from "./sensor-socket/sensor-socket.module";
import { PlankBySessionModule } from "./plank-by-session/plank-by-session.module";
import { ProgramPlanModule } from "./program-plan/program-plan.module";
import { HomeDashboardModule } from "./home-dashboard/home-dashboard.module";
import { UserQuestsModule } from "./user-quests/user-quests.module";

export const AppModules = [
    AuthModule,
    UserModule,
    MissionModule,
    ProgramModule,
    MissionByProgramModule,
    PlankSessionModule,
    SeesionPerfomanceModule,
    PostureModule,
    PostureByProgramModule,
    QuestCategoryModule,
    QuestModule,
    QuestByUesrModule,
    PostureCategoryModule,
    SensorSocketModule,
    PlankBySessionModule,
    ProgramPlanModule,
    HomeDashboardModule,
    UserQuestsModule,
]
