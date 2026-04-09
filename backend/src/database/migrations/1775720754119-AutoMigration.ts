import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775720754119 implements MigrationInterface {
    name = 'AutoMigration1775720754119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "postureName"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "postureDescription"`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "description" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "postureDescription" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "postureName" character varying(255) NOT NULL`);
    }

}
