import { IsDecimal, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PortfolioHolding } from "./portfolio-holding.entity";

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @IsString()
  name!: string;

  @Column({ nullable: true })
  @IsString()
  description?: string;

  @OneToMany(() => PortfolioHolding, (holding) => holding.portfolio)
  holdings!: PortfolioHolding[];

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  totalCostBasis!: string;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  totalFees!: string;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  totalRealizedGains!: string;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  totalSalesTaxes!: string;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  totalDividends!: string;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsDecimal()
  totalDividendTaxes!: string;

  /**
   * The timestamp of the last time this portfolio was updated.
   * Automatically updated on every `save` operation.
   * @type {Date}
   */
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  /**
   * The timestamp of when this portfolio was created.
   * Automatically set on first `save`.
   * @type {Date}
   */
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
