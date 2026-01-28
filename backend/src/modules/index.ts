import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { MissionModule } from "./mission/mission.module";
import { ProgramModule } from "./program/program.module";
import { MissionByProgramModule } from "./mission-by-program/mission-by-program.module";
import { PlankSessionModule } from "./plank-session/plank-session.module";

export const AppModules = [
    AuthModule,
    UserModule,
    MissionModule,
    ProgramModule,
    MissionByProgramModule,
    PlankSessionModule,

]

