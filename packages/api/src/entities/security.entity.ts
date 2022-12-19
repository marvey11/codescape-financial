import { SecurityType } from "@csfin/core";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({
    type: "enum",
    enum: SecurityType
  })
  type!: SecurityType;
}

export { Security, SecurityType };
