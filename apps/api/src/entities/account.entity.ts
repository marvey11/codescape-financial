import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity({ name: "accounts" })
class SecuritiesAccount {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id!: number;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];
}

export { SecuritiesAccount };
