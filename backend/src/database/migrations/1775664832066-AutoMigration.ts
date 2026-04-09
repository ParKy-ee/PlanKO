import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775664832066 implements MigrationInterface {
    name = 'AutoMigration1775664832066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."quest_by_user_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "quest_by_user" ("id" SERIAL NOT NULL, "current_value" integer NOT NULL, "target_value" integer NOT NULL, "status" "public"."quest_by_user_status_enum" NOT NULL, "completed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "quest_id" integer, CONSTRAINT "PK_74dce79f44fbf6d962c946f016b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quest_by_user" ADD CONSTRAINT "FK_edc88f3bfa7366d46af016a5c0d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_by_user" ADD CONSTRAINT "FK_846f9c29a37c6620791c165b868" FOREIGN KEY ("quest_id") REFERENCES "quest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_by_user" DROP CONSTRAINT "FK_846f9c29a37c6620791c165b868"`);
        await queryRunner.query(`ALTER TABLE "quest_by_user" DROP CONSTRAINT "FK_edc88f3bfa7366d46af016a5c0d"`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-06 14:05:44.588'`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-06 14:05:44.588'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-06 14:05:44.585'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-06 14:05:44.585'`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-06 14:05:44.588'`);
        await queryRunner.query(`ALTER TABLE "quest" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-06 14:05:44.588'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-06 14:05:44.585'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-06 14:05:44.585'`);
        await queryRunner.query(`DROP TABLE "quest_by_user"`);
        await queryRunner.query(`DROP TYPE "public"."quest_by_user_status_enum"`);
    }

}
