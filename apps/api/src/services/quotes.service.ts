import { AddQuoteDataDTO } from "@csfin/core";
import { Service } from "typedi";
import { InsertResult, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { QuoteData } from "../entities";
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

  add = async (dto: AddQuoteDataDTO): Promise<InsertResult> => {
    const [security, exchange] = await Promise.all([
      this.securityService.getOneByISIN(dto.isin),
      this.exchangeService.getOneByName(dto.exchange)
    ]);

    const quotes = dto.quotes.map((item) => {
      const qde = new QuoteData();
      qde.security = security;
      qde.exchange = exchange;
      qde.date = item.date;
      qde.price = item.price;
      return qde;
    });

    return this.repository.createQueryBuilder().insert().values(quotes).orUpdate(["price"]).execute();
  };
}
