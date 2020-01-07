import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1578152804876 implements MigrationInterface {
  name = 'User1578152804876';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "user"`, undefined);
  }
}
