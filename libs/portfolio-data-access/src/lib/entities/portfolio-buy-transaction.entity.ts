import { IsDate, IsNumber, IsUUID } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PortfolioHolding } from "./portfolio-holding.entity";

@Entity("portfolio_buy_transactions")
export class PortfolioBuyTransaction {
  /**
   * Primary key for the transaction. Using a UUID.
   *
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * The ID of the portfolio holding this transaction belongs to.
   *
   * This is a foreign key.
   *
   * @type {string}
   */
  @Column({ type: "uuid" })
  @IsUUID()
  holdingId!: string;

  /**
   * The Many-to-One relationship to the PortfolioHolding entity.
   *
   * A single holding can have many buy transactions.
   */
  @ManyToOne(() => PortfolioHolding, (holding) => holding.buyTransactions)
  @JoinColumn({ name: "holdingId" })
  holding!: PortfolioHolding;

  /**
   * The date and time of the transaction. This is critical for FIFO.
   *
   * @type {Date}
   */
  @Column({ type: "timestamp" })
  @IsDate()
  transactionDate!: Date;

  /**
   * The number of shares purchased in this transaction.
   *
   * @type {number}
   */
  @Column({ type: "decimal", precision: 12, scale: 4 })
  @IsNumber()
  shares!: number;

  /**
   * The price per share at the time of purchase.
   *
   * @type {number}
   */
  @Column({ type: "decimal", precision: 12, scale: 4 })
  @IsNumber()
  pricePerShare!: number;

  /**
   * The original number of shares purchased in this transaction.
   * This field is immutable and used for accurate cost basis calculations on partial sales.
   * @type {number}
   */
  @Column({ type: "decimal", precision: 12, scale: 4 })
  @IsNumber()
  originalShares!: number;

  /**
   * The fees associated with this transaction.
   *
   * @type {number}
   */
  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsNumber()
  fees!: number;
}
