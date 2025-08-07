import { MigrationInterface, QueryRunner } from "typeorm";

export class IncreaseNumericPrecision1754429192312
  implements MigrationInterface
{
  name = "IncreaseNumericPrecision1754429192312";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio_buy_transactions" ALTER COLUMN "shares" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_buy_transactions" ALTER COLUMN "pricePerShare" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_buy_transactions" ALTER COLUMN "originalShares" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_buy_transactions" ALTER COLUMN "fees" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "numberOfShares" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "pricePerShare" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "fees" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "taxes" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "splitRatio" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "dividendPerShare" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "applicableShares" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "exchangeRate" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "shares" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "fees" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "totalCostBasis" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "averagePricePerShare" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "realizedGains" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "salesTaxes" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "dividends" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "totalDividendTaxes" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalCostBasis" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalFees" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalRealizedGains" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalSalesTaxes" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalDividends" TYPE numeric(12,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalDividendTaxes" TYPE numeric(12,4)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalDividendTaxes" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalDividends" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalSalesTaxes" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalRealizedGains" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalFees" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ALTER COLUMN "totalCostBasis" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "totalDividendTaxes" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "dividends" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "salesTaxes" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "realizedGains" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "averagePricePerShare" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "totalCostBasis" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "fees" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_holdings" ALTER COLUMN "shares" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "exchangeRate" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "applicableShares" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "dividendPerShare" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "splitRatio" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "taxes" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "fees" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "pricePerShare" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_operations" ALTER COLUMN "numberOfShares" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_buy_transactions" ALTER COLUMN "fees" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_buy_transactions" ALTER COLUMN "originalShares" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_buy_transactions" ALTER COLUMN "pricePerShare" TYPE numeric(10,4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio_buy_transactions" ALTER COLUMN "shares" TYPE numeric(10,4)`,
    );
  }
}
