import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1769829352562 implements MigrationInterface {
    name = 'AutoMigration1769829352562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP CONSTRAINT "FK_be599eef0640bb809c035934970"`);
        await queryRunner.query(`CREATE TYPE "public"."plank_session_status_enum" AS ENUM('pending', 'completed', 'skip')`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD "status" "public"."plank_session_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD CONSTRAINT "FK_be599eef0640bb809c035934970" FOREIGN KEY ("plank_session_id") REFERENCES "plank_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP CONSTRAINT "FK_be599eef0640bb809c035934970"`);
        await queryRunner.query(`ALTER TABLE "plank_session" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."plank_session_status_enum"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD CONSTRAINT "FK_be599eef0640bb809c035934970" FOREIGN KEY ("plank_session_id") REFERENCES "plank_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
