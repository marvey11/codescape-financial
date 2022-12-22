import { TransactionType } from "@csfin/core";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Security } from "./security.entity";

@Entity({ name: "transactions" })
class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: TransactionType })
  type: TransactionType;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "decimal", precision: 11, scale: 3 })
  shares: number;

  @ManyToOne(() => Security, (security) => security.transactions)
  security!: Security;

  constructor(type: TransactionType, date: Date, price: number, shares: number) {
    this.type = type;
    this.date = date;
    this.price = price;
    this.shares = shares;
  }
}

export { Transaction };
