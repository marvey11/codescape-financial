import { AddExchangeDTO } from "@csfin/core";
import { Service } from "typedi";
import { FindOneOptions, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { SecuritiesExchange } from "../entities";

@Service()
export class SecuritiesExchangeService {
  private repository: Repository<SecuritiesExchange>;

  constructor() {
    this.repository = AppDataSource.getRepository<SecuritiesExchange>(SecuritiesExchange);
  }

  /** Returns all the exchanges in the database. */
  getAll = async (): Promise<SecuritiesExchange[]> => this.repository.find();

  getOne = async (options: FindOneOptions): Promise<SecuritiesExchange> => this.repository.findOneOrFail(options);

  getOneByName = async (name: string): Promise<SecuritiesExchange> => this.getOne({ where: { name: name } });

  /** Adds a single exchange to the database. Rejects with error if the exchange could not be saved. */
  addOne = async (dto: AddExchangeDTO): Promise<SecuritiesExchange> => {
    const exchange = new SecuritiesExchange();
    exchange.name = dto.name;
    return this.repository.save(exchange);
  };
}
