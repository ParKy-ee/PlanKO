import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775721152166 implements MigrationInterface {
    name = 'AutoMigration1775721152166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture" DROP CONSTRAINT "FK_18111f2148b6430d7d2fb27d350"`);
        await queryRunner.query(`ALTER TABLE "posture" RENAME COLUMN "postureByCategoryId" TO "postureCategoryId"`);
        await queryRunner.query(`ALTER TABLE "posture" ADD CONSTRAINT "FK_ac6720fa02cf4196cadfc9a4440" FOREIGN KEY ("postureCategoryId") REFERENCES "posture_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture" DROP CONSTRAINT "FK_ac6720fa02cf4196cadfc9a4440"`);
        await queryRunner.query(`ALTER TABLE "posture" RENAME COLUMN "postureCategoryId" TO "postureByCategoryId"`);
        await queryRunner.query(`ALTER TABLE "posture" ADD CONSTRAINT "FK_18111f2148b6430d7d2fb27d350" FOREIGN KEY ("postureByCategoryId") REFERENCES "posture_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
