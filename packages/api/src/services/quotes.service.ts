import { AddQuoteDataDTO, QuoteDataItem } from "@csfin/core";
import { Service } from "typedi";
import { InsertResult, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { QuoteData, SecuritiesExchange, Security } from "../entities";
import { SecuritiesExchangeService } from "./exchanges.service";
import { SecuritiesService } from "./securities.service";

@Service()
export class QuoteDataService {
  private repository: Repository<QuoteData>;

  constructor(private securityService: SecuritiesService, private exchangeService: SecuritiesExchangeService) {
    this.repository = AppDataSource.getRepository<QuoteData>(QuoteData);
  }

  get = async (isin: string, exchange: string): Promise<QuoteData[]> =>
    this.repository
      .createQueryBuilder("q")
      .innerJoin("q.security", "s")
      .innerJoin("q.exchange", "e")
      .where("s.isin = :isin", { isin: isin })
      .andWhere("e.name = :exchangeName", { exchangeName: exchange })
      .getMany();

  add = async (data: AddQuoteDataDTO): Promise<InsertResult> =>
    this.securityService.getOneByISIN(data.isin).then(async (security) =>
      this.exchangeService.getOneByName(data.exchange).then(async (exchange) =>
        this.repository
          .createQueryBuilder()
          .insert()
          .values(data.quotes.map((item) => this.createEntity(item, security, exchange)))
          .orUpdate(["price"])
          .execute()
      )
    );

  private createEntity = ({ date, price }: QuoteDataItem, security: Security, exchange: SecuritiesExchange) => {
    const qd = new QuoteData(date, price);
    qd.security = security;
    qd.exchange = exchange;
    return qd;
  };
}
