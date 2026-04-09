import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775719476019 implements MigrationInterface {
    name = 'AutoMigration1775719476019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posture_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "status" boolean NOT NULL, CONSTRAINT "PK_f097d46880cbc37eb8ecf6af2a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "postureType"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "set"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "second"`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "postureCategoryId" integer`);
        await queryRunner.query(`ALTER TABLE "posture" ADD CONSTRAINT "FK_ac6720fa02cf4196cadfc9a4440" FOREIGN KEY ("postureCategoryId") REFERENCES "posture_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posture" DROP CONSTRAINT "FK_ac6720fa02cf4196cadfc9a4440"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "postureCategoryId"`);
        await queryRunner.query(`ALTER TABLE "posture" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "second" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "set" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "posture" ADD "postureType" character varying(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE "posture_category"`);
    }

}
