import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1769442544437 implements MigrationInterface {
    name = 'AutoMigration1769442544437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mission" DROP CONSTRAINT "FK_2ef79494a6ab0f7de44bbb08298"`);
        await queryRunner.query(`ALTER TABLE "mission" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "mission" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "mission" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "mission" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mission" ADD CONSTRAINT "FK_c7f94f33b61138a419093cb856d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mission" DROP CONSTRAINT "FK_c7f94f33b61138a419093cb856d"`);
        await queryRunner.query(`ALTER TABLE "mission" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mission" ALTER COLUMN "updatedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "mission" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "mission" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "mission" ADD CONSTRAINT "FK_2ef79494a6ab0f7de44bbb08298" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
