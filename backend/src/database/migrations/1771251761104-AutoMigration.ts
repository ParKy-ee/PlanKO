import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771251761104 implements MigrationInterface {
    name = 'AutoMigration1771251761104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "weight" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "height" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "age" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "weight"`);
    }

}
