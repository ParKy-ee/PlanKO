import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775829785520 implements MigrationInterface {
    name = 'AutoMigration1775829785520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-10T14:03:07.536Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-10T14:03:07.536Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-10T14:03:07.566Z"'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-10T14:03:07.566Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-09 16:12:49.731'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-09 16:12:49.731'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "updatedAt" SET DEFAULT '2026-04-09 16:12:49.731'`);
        await queryRunner.query(`ALTER TABLE "user_quests" ALTER COLUMN "createdAt" SET DEFAULT '2026-04-09 16:12:49.731'`);
    }

}
