import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775720483264 implements MigrationInterface {
    name = 'AutoMigration1775720483264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture_category" RENAME COLUMN "status" TO "is_active"`);
        await queryRunner.query(`ALTER TABLE "posture" RENAME COLUMN "isActive" TO "is_active"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture" RENAME COLUMN "is_active" TO "isActive"`);
        await queryRunner.query(`ALTER TABLE "posture_category" RENAME COLUMN "is_active" TO "status"`);
    }

}
