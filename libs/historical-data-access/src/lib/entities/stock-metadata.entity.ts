import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Country } from "./country.entity.js";
import { HistoricalQuote } from "./historical-quote.entity.js";

@Entity("stock_metadata")
@Index(["isin", "nsin"], { unique: true })
export class StockMetadata {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  isin!: string;

  @Column({ unique: true })
  nsin!: string;

  @Column()
  name!: string;

  @Column()
  currency!: string;

  @ManyToOne(() => Country, (country) => country.stocks)
  country!: Country;

  @OneToMany(() => HistoricalQuote, (historicalQuote) => historicalQuote.stock)
  quotes!: HistoricalQuote[];
}
