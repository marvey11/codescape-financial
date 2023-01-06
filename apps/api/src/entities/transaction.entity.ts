import { TransactionType } from "@csfin/core";
import crypto from "node:crypto";
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SecuritiesAccount } from "./account.entity";
import { Security } from "./security.entity";

@Entity({ name: "transactions" })
class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: TransactionType })
  type!: TransactionType;

  /** The transaction date is stored as a simplified ISO 8601 date in the form "YYYY-MM-DD". */
  @Column({ type: "date" })
  date!: string;

  @Column({ type: "decimal", precision: 11, scale: 3 })
  shares!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  /**
   * Making sure that transactions are unique and cannot added more than once. Determining uniqueness is done by
   * calculating a hash over the relevant columns (all of them at the moment, other than the auto-generated ID).
   *
   * A hash eas selected instead of a `@Unique` construct since otherwise the complete row would need to be unique.
   */
  @Column({ unique: true })
  hash!: string;

  @ManyToOne(() => SecuritiesAccount, (account) => account.transactions)
  account!: SecuritiesAccount;

  @ManyToOne(() => Security, (security) => security.transactions)
  security!: Security;

  /**
   * Hash is calculated and set before we try to insert it into the database.
   *
   * Since transactions cannot be updated, we don't need the `@BeforeUpdate()` decorator here.
   */
  @BeforeInsert()
  updateHash = () => {
    this.hash = crypto
      .createHash("sha256")
      .update([this.account.id, this.security.isin, this.type, this.date, this.shares, this.price].join("|"))
      .digest("hex");
  };
}

export { Transaction };
