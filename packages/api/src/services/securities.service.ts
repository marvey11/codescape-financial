import { CreateSecurityDTO } from "@csfin/core";
import { Service } from "typedi";
import { FindOneOptions, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Security } from "../entities";

@Service()
export class SecuritiesService {
  private repository: Repository<Security>;

  constructor() {
    this.repository = AppDataSource.getRepository<Security>(Security);
  }

  /** Returns all the securities in the database. */
  getAll = async (): Promise<Security[]> => this.repository.find();

  /** Returns one security defined by the provided options. Returns `null` if no such security can be found. */
  getOne = async (options: FindOneOptions<Security>): Promise<Security | null> => this.repository.findOne(options);

  /** Returns one security defined by the provided options. Rejects with error if the security cannot be found. */
  getOneOrFail = async (options: FindOneOptions<Security>): Promise<Security> => this.repository.findOneOrFail(options);

  /** Returns one security defined by the ISIN. Rejects with error if there is no security with the specified ISIN. */
  getOneByISIN = async (isin: string): Promise<Security> => this.getOneOrFail({ where: { isin: isin } });

  /** Adds a single security to the database. Rejects with error if the security could not be saved. */
  addOne = async (data: CreateSecurityDTO): Promise<Security> => this.repository.save(this.dto2Entity(data));

  /** Converts a request DTO into a security entity. */
  private dto2Entity = (dto: CreateSecurityDTO): Security => {
    const security = new Security();
    security.isin = dto.isin;
    security.nsin = dto.nsin;
    security.name = dto.name;
    security.shortName = dto.shortName;
    security.type = dto.type;
    return security;
  };
}
