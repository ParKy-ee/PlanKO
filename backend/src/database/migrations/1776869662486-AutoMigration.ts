import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1776869662486 implements MigrationInterface {
    name = 'AutoMigration1776869662486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-22T14:54:24.687Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-22T14:54:24.687Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-22T14:54:24.711Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-22T14:54:24.711Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-22 06:56:20.81'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-22 06:56:20.81'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-22 06:56:20.81'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-22 06:56:20.81'`);
    }

}
