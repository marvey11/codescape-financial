import { AddTransactionDTO } from "@csfin/core";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Transaction } from "../entities";
import { AccountService } from "./accounts.service";
import { SecuritiesService } from "./securities.service";

@Service()
export class TransactionService {
  private repository: Repository<Transaction>;

  constructor(private accountService: AccountService, private securityService: SecuritiesService) {
    this.repository = AppDataSource.getRepository<Transaction>(Transaction);
  }

  /** Returns all the account's transactions. */
  getAll = async (accountID: number): Promise<Transaction[]> =>
    this.repository
      .createQueryBuilder("transaction")
      .innerJoin("transaction.account", "account")
      .innerJoin("transaction.security", "security")
      .where("account.id = :accountID", { accountID: accountID })
      .addSelect("security.isin")
      .getMany();

  /** Returns all the account's transactions for the specified ISIN. */
  getAllByISIN = async (accountID: number, isin: string): Promise<Transaction[]> =>
    this.repository
      .createQueryBuilder("transaction")
      .innerJoin("transaction.account", "account")
      .innerJoin("transaction.security", "security")
      .where("account.id = :accountID", { accountID: accountID })
      .andWhere("security.isin = :isin", { isin: isin })
      .getMany();

  /** Adds a single transaction to the specified account. */
  addOne = async (accountID: number, data: AddTransactionDTO): Promise<Transaction> =>
    this.accountService.getOneByID(accountID).then(async (account) =>
      this.securityService.getOneByISIN(data.isin).then(async (security) => {
        const { type, date, price, shares } = data;
        const transaction = new Transaction(type, date, price, shares);
        transaction.account = account;
        transaction.security = security;
        return this.repository.save(transaction);
      })
    );
}
