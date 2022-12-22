import { AddTransactionDTO } from "@csfin/core";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Transaction } from "../entities";
import { SecuritiesService } from "./securities.service";

@Service()
export class TransactionService {
  private repository: Repository<Transaction>;

  constructor(private securityService: SecuritiesService) {
    this.repository = AppDataSource.getRepository<Transaction>(Transaction);
  }

  getAll = async (): Promise<Transaction[]> => this.repository.find();

  /** Returns all transactions for the provided ISIN. */
  getAllByISIN = async (isin: string): Promise<Transaction[]> =>
    this.repository
      .createQueryBuilder("transaction")
      .innerJoin("transaction.security", "security")
      .where("security.isin = :isin")
      .setParameter("isin", isin)
      .getMany();

  /** Adds a single transaction. */
  addOne = async (data: AddTransactionDTO): Promise<Transaction> => {
    return this.securityService.getOneByISIN(data.isin).then((security) => {
      const { type, date, price, shares } = data;
      const transaction = new Transaction(type, date, price, shares);
      transaction.security = security;
      return this.repository.save(transaction);
    });
  };
}
