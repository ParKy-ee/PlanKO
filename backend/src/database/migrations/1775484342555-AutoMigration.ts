import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775484342555 implements MigrationInterface {
    name = 'AutoMigration1775484342555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."quest_unit_enum" AS ENUM('repeat', 'second', 'session')`);
        await queryRunner.query(`CREATE TYPE "public"."quest_quest_type_enum" AS ENUM('daily', 'weekly', 'monthly')`);
        await queryRunner.query(`CREATE TYPE "public"."quest_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`CREATE TABLE "quest" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "goal_value" integer NOT NULL, "unit" "public"."quest_unit_enum" NOT NULL, "quest_type" "public"."quest_quest_type_enum" NOT NULL, "xp_reward" integer NOT NULL, "coin_reward" integer NOT NULL, "difficulty" "public"."quest_difficulty_enum" NOT NULL, "description" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2026-04-06T14:05:44.568Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2026-04-06T14:05:44.568Z"', "quest_category_id" integer, CONSTRAINT "PK_0d6873502a58302d2ae0b82631c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-06T14:05:44.480Z"'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-06T14:05:44.480Z"'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-06T14:05:44.585Z"'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-06T14:05:44.585Z"'`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-06T14:05:44.588Z"'`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-06T14:05:44.588Z"'`);
        await queryRunner.query(`ALTER TABLE "quest" ADD CONSTRAINT "FK_e5d8101fc706d356b94485a7134" FOREIGN KEY ("quest_category_id") REFERENCES "quest_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest" DROP CONSTRAINT "FK_e5d8101fc706d356b94485a7134"`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-06T14:05:44.568Z"'`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-06T14:05:44.568Z"'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-06 13:42:12.199'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-06 13:42:12.199'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-06 13:42:12.199'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-06 13:42:12.199'`);
        await queryRunner.query(`DROP TABLE "quest"`);
        await queryRunner.query(`DROP TYPE "public"."quest_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."quest_quest_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."quest_unit_enum"`);
    }

}
