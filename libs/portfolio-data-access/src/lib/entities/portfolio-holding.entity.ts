import { StockMetadata } from "@codescape-financial/historical-data-access";
import { IsDecimal, IsUUID } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PortfolioBuyTransaction } from "./portfolio-buy-transaction.entity";
import { PortfolioOperation } from "./portfolio-operation.entity";
import { Portfolio } from "./portfolio.entity";

@Entity("portfolio_holdings")
@Index(["portfolioId", "stockId"], { unique: true }) // Ensure only one holding per stock within a specific portfolio
export class PortfolioHolding {
  /**
   * Primary key for the portfolio holding. Using a UUID.
   *
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * The ID of the portfolio this holding belongs to.
   *
   * @type {string}
   */
  @Column({ type: "uuid" })
  @IsUUID()
  portfolioId!: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.holdings)
  @JoinColumn({ name: "portfolioId" })
  portfolio!: Portfolio;

  /**
   * The stock's ID. This is the foreign key.
   *
   * @type {string}
   */
  @Column({ type: "uuid" })
  @IsUUID()
  stockId!: string;

  /**
   * The Many-to-One relationship to the StockMetadata entity.
   *
   * This is a unidirectional relationship to avoid circular dependencies.
   */
  @ManyToOne(() => StockMetadata)
  @JoinColumn({ name: "stockId" })
  stockMetadata!: StockMetadata;

  /**
   * A one-to-many relationship to the PortfolioBuyTransaction entity.
   * This will hold all individual buy transactions that make up this holding.
   */
  @OneToMany(() => PortfolioBuyTransaction, (buyTx) => buyTx.holding, {
    eager: true,
    cascade: ["insert"],
  })
  buyTransactions!: PortfolioBuyTransaction[];

  /**
   * A one-to-many relationship to the PortfolioOperation entity.
   * This provides a complete audit trail of all actions (buy, sell, dividend, etc.) for this holding.
   */
  @OneToMany(() => PortfolioOperation, (operation) => operation.holding, {
    cascade: ["insert"],
  })
  operations!: PortfolioOperation[];

  /**
   * The current number of shares held.
   * @type {string}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  shares!: string;

  /**
   * The total fees from all of the portfolio operations involved in this holding.
   *
   * @type{string}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  fees!: string;

  /**
   * The total cost basis of a holding represents the total amount of money effectively paid to
   * acquire the currently held shares, including all relevant costs.
   *
   * It allows the calculation of current unrealised gains (market value - total cost basis).
   *
   * @type{string}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  totalCostBasis!: string;

  /**
   * The average price per share for the current holding.
   *
   * Includes all relevant fees.
   *
   * @type {string}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  averagePricePerShare!: string;

  /**
   * The total realised gains (profits/losses from sales).
   *
   * Includes all relevant fees, but not the taxes.
   *
   * @type {string}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  realizedGains!: string;

  /**
   * The taxes from sales of shares in ths portfolio holding.
   *
   * @type{string}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  salesTaxes!: string;

  /**
   * The dividends received from shares in this portfolio holding.
   *
   * Does not include taxes.
   *
   * @type{string}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  dividends!: string;

  /**
   * The taxes incurred from receiving dividends.
   *
   * @type{string}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  totalDividendTaxes!: string;

  /**
   * The timestamp of the last time this holding was updated.
   *
   * @type {Date}
   */
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  /**
   * The timestamp of when this holding was created.
   * Automatically set on first `save`.
   * @type {Date}
   */
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
