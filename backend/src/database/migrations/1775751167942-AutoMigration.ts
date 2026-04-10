import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775751167942 implements MigrationInterface {
    name = 'AutoMigration1775751167942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "program_plan" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "program_id" integer, "plank_session_id" integer, CONSTRAINT "PK_ca0700956459ded15858a90c0aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_quests" ("id" SERIAL NOT NULL, "quest_id" integer NOT NULL, "user_id" integer NOT NULL, "current_value" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2026-04-09T16:12:49.705Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2026-04-09T16:12:49.705Z"', "questIdId" integer, CONSTRAINT "PK_26397091cd37dde7d59fde6084d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN "rest"`);
        await queryRunner.query(`ALTER TABLE "program" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-09T16:12:49.731Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-09T16:12:49.731Z"'`);
        await queryRunner.query(`ALTER TABLE "program_plan" ADD CONSTRAINT "FK_1833eb5e11df60cdec4cf53613a" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "program_plan" ADD CONSTRAINT "FK_936c51273548648c43679befc23" FOREIGN KEY ("plank_session_id") REFERENCES "plank_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_quests" ADD CONSTRAINT "FK_20aaf0080cbbdb8a51d8fffe2bb" FOREIGN KEY ("questIdId") REFERENCES "quest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quests" DROP CONSTRAINT "FK_20aaf0080cbbdb8a51d8fffe2bb"`);
        await queryRunner.query(`ALTER TABLE "program_plan" DROP CONSTRAINT "FK_936c51273548648c43679befc23"`);
        await queryRunner.query(`ALTER TABLE "program_plan" DROP CONSTRAINT "FK_1833eb5e11df60cdec4cf53613a"`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-09T16:12:49.705Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-09T16:12:49.705Z"'`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "program" ADD "rest" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "program" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`DROP TABLE "user_quests"`);
        await queryRunner.query(`DROP TABLE "program_plan"`);
    }

}
