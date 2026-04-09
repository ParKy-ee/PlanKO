import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775745282558 implements MigrationInterface {
    name = 'AutoMigration1775745282558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plank_session" DROP CONSTRAINT "FK_d1bfed459ad691b1d2bd56a024a"`);
        await queryRunner.query(`ALTER TABLE "posture_by_program" DROP CONSTRAINT "FK_c4cc8875803c2b6a9c5522af1a1"`);
        await queryRunner.query(`CREATE TABLE "plank_by_session" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "duration" integer NOT NULL, "rest" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "plankSessionId" integer, "postureId" integer, CONSTRAINT "PK_cbb3ad10e5593cfb7cf318ebf75" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP COLUMN "figure_count"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "mode"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."plank_session_status_enum"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD "score" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD "completed" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD "start_time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD "end_time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "description" text`);
        await queryRunner.query(`CREATE TYPE "public"."posture_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "difficulty" "public"."posture_difficulty_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD CONSTRAINT "FK_21460fccbcdf82bddd8211129c5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plank_by_session" ADD CONSTRAINT "FK_da2863c652ad43d064ff9db145a" FOREIGN KEY ("plankSessionId") REFERENCES "plank_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plank_by_session" ADD CONSTRAINT "FK_6cec8bdc807ee498696a9a90c82" FOREIGN KEY ("postureId") REFERENCES "posture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plank_by_session" DROP CONSTRAINT "FK_6cec8bdc807ee498696a9a90c82"`);
        await queryRunner.query(`ALTER TABLE "plank_by_session" DROP CONSTRAINT "FK_da2863c652ad43d064ff9db145a"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP CONSTRAINT "FK_21460fccbcdf82bddd8211129c5"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "difficulty"`);
        await queryRunner.query(`DROP TYPE "public"."posture_difficulty_enum"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP COLUMN "score"`);
        await queryRunner.query(`CREATE TYPE "public"."plank_session_status_enum" AS ENUM('pending', 'completed', 'skip')`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "status" "public"."plank_session_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "completed" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "mode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "duration" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "end_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "start_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD "figure_count" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "plank_by_session"`);
        await queryRunner.query(`ALTER TABLE "posture_by_program" ADD CONSTRAINT "FK_c4cc8875803c2b6a9c5522af1a1" FOREIGN KEY ("postureId") REFERENCES "posture"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD CONSTRAINT "FK_d1bfed459ad691b1d2bd56a024a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
