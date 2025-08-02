import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockMetadata } from "./stock-metadata.entity.js";

@Entity("countries")
export class Country {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 100 })
  name!: string;

  @Column({ unique: true, length: 2, comment: "ISO 3166-1 alpha-2 code" })
  isoCode!: string;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 4,
    default: 0,
    comment: "e.g., 0.2637 for 26.37%",
  })
  withholdingTaxRate!: number;

  @OneToMany(() => StockMetadata, (stockMetadata) => stockMetadata.country)
  stocks!: StockMetadata[];
}
