import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1776840978767 implements MigrationInterface {
    name = 'AutoMigration1776840978767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture" ADD "benefit" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "posture_position" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-22T06:56:20.776Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-22T06:56:20.776Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-22T06:56:20.810Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-22T06:56:20.810Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-21 08:32:16.963'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-21 08:32:16.963'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-21 08:32:16.963'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-21 08:32:16.963'`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "posture_position"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "benefit"`);
    }

}
