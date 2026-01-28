import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1769530216323 implements MigrationInterface {
    name = 'AutoMigration1769530216323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."program_programtype_enum" AS ENUM('daily', 'weekly', 'monthly')`);
        await queryRunner.query(`CREATE TABLE "program" ("id" SERIAL NOT NULL, "programName" character varying(255) NOT NULL, "programType" "public"."program_programtype_enum" NOT NULL, "period" integer NOT NULL, "frequency" integer NOT NULL, "workDays" integer array NOT NULL, "restDays" integer array NOT NULL, "status" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mission_by_program" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "programId" integer NOT NULL, "missionId" integer NOT NULL, CONSTRAINT "PK_fafea8a7ceb5b03c34590492c8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mission" ("id" SERIAL NOT NULL, "target" character varying(255) NOT NULL, "startAt" TIMESTAMP NOT NULL, "endAt" TIMESTAMP NOT NULL, "status" "public"."mission_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_54f1391034bc7dd30666dee0d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mission_by_program" ADD CONSTRAINT "FK_8f5b218cf59033bdceee34e0fd5" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mission_by_program" ADD CONSTRAINT "FK_e906d6116ea4344b8d7115837b9" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mission" ADD CONSTRAINT "FK_c7f94f33b61138a419093cb856d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mission" DROP CONSTRAINT "FK_c7f94f33b61138a419093cb856d"`);
        await queryRunner.query(`ALTER TABLE "mission_by_program" DROP CONSTRAINT "FK_e906d6116ea4344b8d7115837b9"`);
        await queryRunner.query(`ALTER TABLE "mission_by_program" DROP CONSTRAINT "FK_8f5b218cf59033bdceee34e0fd5"`);
        await queryRunner.query(`DROP TABLE "mission"`);
        await queryRunner.query(`DROP TABLE "mission_by_program"`);
        await queryRunner.query(`DROP TABLE "program"`);
        await queryRunner.query(`DROP TYPE "public"."program_programtype_enum"`);
    }

}
