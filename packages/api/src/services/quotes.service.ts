import { CreateQuotesDTO } from "@csfin/core";
import { Service } from "typedi";
import { InsertResult, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { QuoteData } from "../entities";
import { SecuritiesExchangeService } from "./exchanges.service";
import { SecuritiesService } from "./securities.service";

@Service()
export class QuotesService {
  private repository: Repository<QuoteData>;

  constructor(private securityService: SecuritiesService, private exchangeService: SecuritiesExchangeService) {
    this.repository = AppDataSource.getRepository<QuoteData>(QuoteData);
  }

  get = async (isin: string, exchange: string): Promise<QuoteData[]> =>
    this.repository
      .createQueryBuilder("q")
      .innerJoin("q.security", "s")
      .innerJoin("q.exchange", "e")
      .where("s.isin = :isin")
      .andWhere("e.name = :exchangeName")
      .setParameters({ isin: isin, exchangeName: exchange })
      .getMany();

  add = async (data: CreateQuotesDTO): Promise<InsertResult> => {
    return this.securityService.getOneByISIN(data.isin).then(async (security) => {
      const exchange = await this.exchangeService.getOneByName(data.exchange);

      const quoteItems = data.quotes.map(({ date, price }) => {
        const qd = new QuoteData();
        qd.security = security;
        qd.exchange = exchange;
        qd.date = date;
        qd.quote = price;
        return qd;
      });

      return this.repository.createQueryBuilder().insert().values(quoteItems).execute();
    });
  };
}
