import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PortfolioHolding } from "./portfolio-holding.entity";

export enum OperationType {
  BUY = "buy",
  SELL = "sell",
  STOCK_SPLIT = "stock_split",
  DIVIDEND = "dividend",
}

@Entity("portfolio_operations")
export class PortfolioOperation {
  /**
   * Primary key for the portfolio operation.
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * The ID of the portfolio holding this operation belongs to.
   * This links the operation to a specific stock within a portfolio.
   * @type {string}
   */
  @Column({ type: "uuid" })
  @IsUUID()
  holdingId!: string;

  @ManyToOne(() => PortfolioHolding, (holding) => holding.operations)
  @JoinColumn({ name: "holdingId" })
  holding!: PortfolioHolding;

  // --- Parameters for all Transactions ---

  /**
   * The type of the operation. This is the key field that distinguishes
   * a buy from a sell, a stock split, or a dividend.
   */
  @Column({ type: "enum", enum: OperationType })
  @IsEnum(OperationType)
  type!: OperationType;

  /**
   * The date the operation occurred.
   * @type {string}
   */
  @Column({ type: "timestamp" })
  @IsDate()
  date!: Date;

  // --- Parameters for BUY and SELL Transactions ---

  /**
   * The number of shares involved in the transaction.
   * Nullable, as it is not applicable for a stock split.
   * @type {number | null}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
  @IsOptional()
  @IsNumber()
  numberOfShares?: number;

  /**
   * The price per share at the time of the transaction.
   * Nullable, as it is not applicable for a stock split or dividend.
   * @type {number | null}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
  @IsOptional()
  @IsNumber()
  pricePerShare?: number;

  /**
   * Fees associated with the transaction (buy or sell).
   * Nullable for operations that do not have fees.
   * @type {number | null}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
  @IsOptional()
  @IsNumber()
  fees?: number;

  // --- Parameters for SELL Transactions and DIVIDENDS ---

  /**
   * Taxes applied to the transaction (sell) or dividend.
   * Nullable for operations that do not have taxes.
   * @type {number | null}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
  @IsOptional()
  @IsNumber()
  taxes?: number;

  // --- Parameters for STOCK SPLITS ---

  /**
   * The ratio of the stock split (e.g., 2 for a 2-for-1 split).
   * Nullable, as it is only applicable for stock splits.
   * @type {number | null}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
  @IsOptional()
  @IsNumber()
  splitRatio?: number;

  // --- Parameters for DIVIDEND Payments ---

  /**
   * The dividend amount per share.
   * Nullable, as it is only applicable for dividends.
   * @type {number | null}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
  @IsOptional()
  @IsNumber()
  dividendPerShare?: number;

  /**
   * The number of shares applicable for the dividend payment.
   * Nullable, as it is only applicable for dividends.
   * @type {number | null}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
  @IsOptional()
  @IsNumber()
  applicableShares?: number;

  /**
   * The exchange rate if the dividend is in a different currency.
   * Nullable, as it is only applicable for dividends.
   * @type {number | null}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, nullable: true })
  @IsOptional()
  @IsNumber()
  exchangeRate?: number;

  /**
   * The timestamp of when this operation was created.
   * Automatically set on first `save`.
   * @type {Date}
   */
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
