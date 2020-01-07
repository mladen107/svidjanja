import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLike1578427195976 implements MigrationInterface {
  name = 'UserLike1578427195976';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_like" ("id" SERIAL NOT NULL, "giverId" integer, "receiverId" integer, CONSTRAINT "PK_7ed1892691b28e1e1dfc34c4249" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_580822718873740edfc0b4279c" ON "user_like" ("giverId", "receiverId") `,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_like" ADD CONSTRAINT "FK_0a7577b4ca05e1078d4ea628fd9" FOREIGN KEY ("giverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_like" ADD CONSTRAINT "FK_082e870c79cff0428b65405260a" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_like" DROP CONSTRAINT "FK_082e870c79cff0428b65405260a"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_like" DROP CONSTRAINT "FK_0a7577b4ca05e1078d4ea628fd9"`,
      undefined,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_580822718873740edfc0b4279c"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "user_like"`, undefined);
  }
}
