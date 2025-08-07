import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreationTimestamps1754429472891 implements MigrationInterface {
  name = "AddCreationTimestamps1754429472891";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" DROP COLUMN "createdAt"`,
    );
  }
}
