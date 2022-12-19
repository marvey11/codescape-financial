import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SecuritiesExchange } from "./exchange.entity";
import { Security } from "./security.entity";

@Entity({ name: "quotes" })
@Unique(["date", "security", "exchange"])
class QuoteData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "decimal", precision: 12, scale: 4 })
  price: number;

  @ManyToOne(() => Security, (security) => security.quotes)
  security!: Security;

  @ManyToOne(() => SecuritiesExchange, (exchange) => exchange.quotes)
  exchange!: SecuritiesExchange;

  constructor(date: Date, price: number) {
    this.date = date;
    this.price = price;
  }
}

export { QuoteData };
