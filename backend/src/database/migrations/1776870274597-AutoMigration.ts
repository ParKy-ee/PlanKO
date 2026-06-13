import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1776870274597 implements MigrationInterface {
    name = 'AutoMigration1776870274597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posture_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f097d46880cbc37eb8ecf6af2a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session_perfomance" ("id" SERIAL NOT NULL, "accuracy_avg" integer NOT NULL, "perfect_count" integer NOT NULL, "good_count" integer NOT NULL, "bad_count" integer NOT NULL, "missed_count" integer NOT NULL, "score" integer NOT NULL, "completed" boolean NOT NULL, "kcal" integer NOT NULL, "duration" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "plank_session_id" integer, "user_id" integer, CONSTRAINT "PK_423ade5a66d0fa4f3aaa984ac19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "program_plan" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "program_id" integer, "plank_session_id" integer, CONSTRAINT "PK_ca0700956459ded15858a90c0aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plank_session" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "total_score" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d80e96c700c17c681267c8cced1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plank_by_session" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "duration" integer NOT NULL, "rest" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "plankSessionId" integer, "postureId" integer, CONSTRAINT "PK_cbb3ad10e5593cfb7cf318ebf75" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posture" ("id" SERIAL NOT NULL, "difficulty" "public"."posture_difficulty_enum" NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "benefit" character varying(255) NOT NULL, "posture_position" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postureCategoryId" integer, CONSTRAINT "PK_a16931e28b2b645df5e07980901" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posture_by_program" ("id" SERIAL NOT NULL, "programId" integer NOT NULL, "postureId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f518622a8f6074131a1e6bd90b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "program" ("id" SERIAL NOT NULL, "programName" character varying(255) NOT NULL, "programType" "public"."program_programtype_enum" NOT NULL, "period" integer NOT NULL, "frequency" integer NOT NULL, "workDays" integer array NOT NULL, "restDays" integer array NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mission_by_program" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "programId" integer NOT NULL, "missionId" integer NOT NULL, CONSTRAINT "PK_fafea8a7ceb5b03c34590492c8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mission" ("id" SERIAL NOT NULL, "target" integer NOT NULL, "current" integer NOT NULL, "startAt" TIMESTAMP NOT NULL, "endAt" TIMESTAMP NOT NULL, "status" "public"."mission_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_54f1391034bc7dd30666dee0d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "role" character varying NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "weight" integer, "height" integer, "age" integer, "gender" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "quest_by_user" ("id" SERIAL NOT NULL, "current_value" integer NOT NULL, "target_value" integer NOT NULL, "status" "public"."quest_by_user_status_enum" NOT NULL, "completed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "quest_id" integer, CONSTRAINT "PK_74dce79f44fbf6d962c946f016b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quest_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf942495edb7fdb4e04bcaead2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quest" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "goal_value" integer NOT NULL, "unit" "public"."quest_unit_enum" NOT NULL, "quest_type" "public"."quest_quest_type_enum" NOT NULL, "xp_reward" integer NOT NULL, "coin_reward" integer NOT NULL, "difficulty" "public"."quest_difficulty_enum" NOT NULL, "description" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quest_category_id" integer, CONSTRAINT "PK_0d6873502a58302d2ae0b82631c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_quests" ("id" SERIAL NOT NULL, "quest_id" integer NOT NULL, "user_id" integer NOT NULL, "current_value" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2026-04-22T15:04:36.848Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2026-04-22T15:04:36.848Z"', "questIdId" integer, CONSTRAINT "PK_26397091cd37dde7d59fde6084d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD CONSTRAINT "FK_be599eef0640bb809c035934970" FOREIGN KEY ("plank_session_id") REFERENCES "plank_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD CONSTRAINT "FK_21460fccbcdf82bddd8211129c5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "program_plan" ADD CONSTRAINT "FK_1833eb5e11df60cdec4cf53613a" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "program_plan" ADD CONSTRAINT "FK_936c51273548648c43679befc23" FOREIGN KEY ("plank_session_id") REFERENCES "plank_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plank_by_session" ADD CONSTRAINT "FK_da2863c652ad43d064ff9db145a" FOREIGN KEY ("plankSessionId") REFERENCES "plank_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plank_by_session" ADD CONSTRAINT "FK_6cec8bdc807ee498696a9a90c82" FOREIGN KEY ("postureId") REFERENCES "posture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posture" ADD CONSTRAINT "FK_ac6720fa02cf4196cadfc9a4440" FOREIGN KEY ("postureCategoryId") REFERENCES "posture_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posture_by_program" ADD CONSTRAINT "FK_6f76a0683e1c9642aee6adfef61" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mission_by_program" ADD CONSTRAINT "FK_8f5b218cf59033bdceee34e0fd5" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mission_by_program" ADD CONSTRAINT "FK_e906d6116ea4344b8d7115837b9" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mission" ADD CONSTRAINT "FK_c7f94f33b61138a419093cb856d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_by_user" ADD CONSTRAINT "FK_edc88f3bfa7366d46af016a5c0d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_by_user" ADD CONSTRAINT "FK_846f9c29a37c6620791c165b868" FOREIGN KEY ("quest_id") REFERENCES "quest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest" ADD CONSTRAINT "FK_e5d8101fc706d356b94485a7134" FOREIGN KEY ("quest_category_id") REFERENCES "quest_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_quests" ADD CONSTRAINT "FK_20aaf0080cbbdb8a51d8fffe2bb" FOREIGN KEY ("questIdId") REFERENCES "quest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quests" DROP CONSTRAINT "FK_20aaf0080cbbdb8a51d8fffe2bb"`);
        await queryRunner.query(`ALTER TABLE "quest" DROP CONSTRAINT "FK_e5d8101fc706d356b94485a7134"`);
        await queryRunner.query(`ALTER TABLE "quest_by_user" DROP CONSTRAINT "FK_846f9c29a37c6620791c165b868"`);
        await queryRunner.query(`ALTER TABLE "quest_by_user" DROP CONSTRAINT "FK_edc88f3bfa7366d46af016a5c0d"`);
        await queryRunner.query(`ALTER TABLE "mission" DROP CONSTRAINT "FK_c7f94f33b61138a419093cb856d"`);
        await queryRunner.query(`ALTER TABLE "mission_by_program" DROP CONSTRAINT "FK_e906d6116ea4344b8d7115837b9"`);
        await queryRunner.query(`ALTER TABLE "mission_by_program" DROP CONSTRAINT "FK_8f5b218cf59033bdceee34e0fd5"`);
        await queryRunner.query(`ALTER TABLE "posture_by_program" DROP CONSTRAINT "FK_6f76a0683e1c9642aee6adfef61"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP CONSTRAINT "FK_ac6720fa02cf4196cadfc9a4440"`);
        await queryRunner.query(`ALTER TABLE "plank_by_session" DROP CONSTRAINT "FK_6cec8bdc807ee498696a9a90c82"`);
        await queryRunner.query(`ALTER TABLE "plank_by_session" DROP CONSTRAINT "FK_da2863c652ad43d064ff9db145a"`);
        await queryRunner.query(`ALTER TABLE "program_plan" DROP CONSTRAINT "FK_936c51273548648c43679befc23"`);
        await queryRunner.query(`ALTER TABLE "program_plan" DROP CONSTRAINT "FK_1833eb5e11df60cdec4cf53613a"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP CONSTRAINT "FK_21460fccbcdf82bddd8211129c5"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP CONSTRAINT "FK_be599eef0640bb809c035934970"`);
        await queryRunner.query(`DROP TABLE "user_quests"`);
        await queryRunner.query(`DROP TABLE "quest"`);
        await queryRunner.query(`DROP TABLE "quest_category"`);
        await queryRunner.query(`DROP TABLE "quest_by_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "mission"`);
        await queryRunner.query(`DROP TABLE "mission_by_program"`);
        await queryRunner.query(`DROP TABLE "program"`);
        await queryRunner.query(`DROP TABLE "posture_by_program"`);
        await queryRunner.query(`DROP TABLE "posture"`);
        await queryRunner.query(`DROP TABLE "plank_by_session"`);
        await queryRunner.query(`DROP TABLE "plank_session"`);
        await queryRunner.query(`DROP TABLE "program_plan"`);
        await queryRunner.query(`DROP TABLE "session_perfomance"`);
        await queryRunner.query(`DROP TABLE "posture_category"`);
    }

}
