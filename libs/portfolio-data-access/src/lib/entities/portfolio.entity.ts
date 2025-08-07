import { IsNumber, IsString } from "class-validator";
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
  @IsNumber()
  totalCostBasis!: number;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsNumber()
  totalFees!: number;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsNumber()
  totalRealizedGains!: number;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsNumber()
  totalSalesTaxes!: number;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsNumber()
  totalDividends!: number;

  @Column({ type: "decimal", precision: 12, scale: 4, default: 0 })
  @IsNumber()
  totalDividendTaxes!: number;

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
