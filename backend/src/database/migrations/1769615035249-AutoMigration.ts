import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1769615035249 implements MigrationInterface {
    name = 'AutoMigration1769615035249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session_perfomance" ("id" SERIAL NOT NULL, "accuracy_avg" integer NOT NULL, "perfect_count" integer NOT NULL, "good_count" integer NOT NULL, "bad_count" integer NOT NULL, "missed_count" integer NOT NULL, "figure_count" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "plank_session_id" integer, CONSTRAINT "PK_423ade5a66d0fa4f3aaa984ac19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plank_session" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "mode" character varying NOT NULL, "total_score" integer NOT NULL, "completed" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_d80e96c700c17c681267c8cced1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" ADD CONSTRAINT "FK_be599eef0640bb809c035934970" FOREIGN KEY ("plank_session_id") REFERENCES "plank_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plank_session" ADD CONSTRAINT "FK_d1bfed459ad691b1d2bd56a024a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plank_session" DROP CONSTRAINT "FK_d1bfed459ad691b1d2bd56a024a"`);
        await queryRunner.query(`ALTER TABLE "session_perfomance" DROP CONSTRAINT "FK_be599eef0640bb809c035934970"`);
        await queryRunner.query(`DROP TABLE "plank_session"`);
        await queryRunner.query(`DROP TABLE "session_perfomance"`);
    }

}
