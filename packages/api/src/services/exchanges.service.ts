import { CreateExchangeDTO } from "@csfin/core";
import { Service } from "typedi";
import { Repository } from "typeorm";
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

  /** Adds a single exchange to the database. Rejects with error if the exchange could not be saved. */
  addOne = async (dto: CreateExchangeDTO): Promise<SecuritiesExchange> => {
    return this.repository.save(this.dto2Entity(dto));
  };

  /** Converts a request DTO into an exchange entity. */
  private dto2Entity = (dto: CreateExchangeDTO): SecuritiesExchange => {
    const exchange = new SecuritiesExchange();
    exchange.name = dto.name;
    return exchange;
  };
}
