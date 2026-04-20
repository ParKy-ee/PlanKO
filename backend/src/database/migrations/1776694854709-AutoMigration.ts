import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1776694854709 implements MigrationInterface {
    name = 'AutoMigration1776694854709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mission" ADD "target" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mission" ADD "current" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-20T14:20:56.802Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-20T14:20:56.803Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-20T14:20:56.834Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-20T14:20:56.834Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-18 14:40:01.244'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-18 14:40:01.244'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-18 14:40:01.244'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-18 14:40:01.244'`);
        await queryRunner.query(`ALTER TABLE "mission" DROP COLUMN "current"`);
        await queryRunner.query(`ALTER TABLE "mission" DROP COLUMN "target"`);
    }

}
