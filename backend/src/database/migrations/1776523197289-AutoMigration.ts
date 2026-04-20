import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1776523197289 implements MigrationInterface {
    name = 'AutoMigration1776523197289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mission" DROP CONSTRAINT "FK_c7f94f33b61138a419093cb856d"`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-18T14:40:01.195Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-18T14:40:01.195Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-18T14:40:01.244Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-18T14:40:01.244Z"'`);
        await queryRunner.query(`ALTER TABLE "mission" ADD CONSTRAINT "FK_c7f94f33b61138a419093cb856d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mission" DROP CONSTRAINT "FK_c7f94f33b61138a419093cb856d"`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-18 14:32:38.877'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-18 14:32:38.877'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-18 14:32:38.877'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-18 14:32:38.877'`);
        await queryRunner.query(`ALTER TABLE "mission" ADD CONSTRAINT "FK_c7f94f33b61138a419093cb856d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
