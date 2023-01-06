import { SecurityType } from "@csfin/core";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuoteData } from "./quote.entity";
import { Transaction } from "./transaction.entity";

@Entity({ name: "securities" })
class Security {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  isin!: string;

  @Column()
  nsin!: string;

  @Column()
  name!: string;

  @Column({ name: "short_name", nullable: true })
  shortName?: string;

  @Column({ type: "enum", enum: SecurityType })
  type!: SecurityType;

  @OneToMany(() => QuoteData, (quote) => quote.security)
  quotes!: QuoteData[];

  @OneToMany(() => Transaction, (transaction) => transaction.security)
  transactions!: Transaction[];
}

export { Security, SecurityType };
