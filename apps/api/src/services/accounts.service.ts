import { CreateAccountDTO } from "@csfin/core";
import { Service } from "typedi";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { SecuritiesAccount } from "../entities";

@Service()
export class AccountService {
  private repository: Repository<SecuritiesAccount>;

  constructor() {
    this.repository = AppDataSource.getRepository<SecuritiesAccount>(SecuritiesAccount);
  }

  getAll = async (): Promise<SecuritiesAccount[]> => this.repository.find();

  getOne = async (options: FindOneOptions<SecuritiesAccount>): Promise<SecuritiesAccount> =>
    this.repository.findOneOrFail(options);

  getOneBy = async (options: FindOptionsWhere<SecuritiesAccount>): Promise<SecuritiesAccount> =>
    this.repository.findOneByOrFail(options);

  getOneByID = async (id: number): Promise<SecuritiesAccount> => this.getOneBy({ id: id });

  addOne = async (dto: CreateAccountDTO): Promise<SecuritiesAccount> => {
    const account = new SecuritiesAccount();
    account.name = dto.name;
    account.description = dto.description;
    return this.repository.save(account);
  };
}
