import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StockMetadata } from "./stock-metadata.entity";

@Entity("historical_quotes")
@Index(["stock", "date"], { unique: true })
export class HistoricalQuote {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => StockMetadata, (stockMetadata) => stockMetadata.quotes)
  stock!: StockMetadata;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  open!: string;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  high!: string;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  low!: string;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  close!: string;

  @Column({ type: "bigint" })
  volume!: string;
}
