import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775720048623 implements MigrationInterface {
    name = 'AutoMigration1775720048623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture_category" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "posture_category" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture_category" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "posture_category" DROP COLUMN "createdAt"`);
    }

}
