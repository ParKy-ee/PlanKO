import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775720200445 implements MigrationInterface {
    name = 'AutoMigration1775720200445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture_category" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "posture_category" ALTER COLUMN "status" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture_category" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posture_category" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
