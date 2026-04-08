import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775482913078 implements MigrationInterface {
    name = 'AutoMigration1775482913078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quest_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2026-04-06T13:42:12.197Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2026-04-06T13:42:12.197Z"', CONSTRAINT "PK_bf942495edb7fdb4e04bcaead2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-06T13:42:12.199Z"'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-06T13:42:12.199Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "updatedAt" SET DEFAULT '"2026-04-06T13:42:12.197Z"'`);
        await queryRunner.query(`ALTER TABLE "quest_category" ALTER COLUMN "createdAt" SET DEFAULT '"2026-04-06T13:42:12.197Z"'`);
        await queryRunner.query(`DROP TABLE "quest_category"`);
    }

}
