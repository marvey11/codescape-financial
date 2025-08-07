import {
  AllLatestQuotesResponseDTO,
  LatestQuoteResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HistoricalQuote } from "../entities";

@Injectable()
export class HistoricalQuoteService {
  constructor(
    @InjectRepository(HistoricalQuote)
    private historicalQuoteRepository: Repository<HistoricalQuote>,
  ) {}

  async findAll(): Promise<HistoricalQuote[]> {
    return this.historicalQuoteRepository.find({ relations: ["stock"] });
  }

  async findLatestByIsin(isin: string): Promise<LatestQuoteResponseDTO | null> {
    return this.historicalQuoteRepository
      .findOne({
        where: { stock: { isin } },
        order: { date: "DESC" },
        relations: ["stock"],
      })
      .then(this.mapToLatestQuoteDTO);
  }

  async findLatestByIsins(
    isins: string[],
  ): Promise<AllLatestQuotesResponseDTO> {
    if (isins.length === 0) {
      return {};
    }

    // This query uses a PostgreSQL-specific feature `DISTINCT ON` to efficiently
    // retrieve the latest quote for each ISIN in a single database round-trip.
    const latestQuotes = await this.historicalQuoteRepository
      .createQueryBuilder("hq")
      .innerJoinAndSelect("hq.stock", "stock")
      .distinctOn(["stock.isin"])
      .where("stock.isin IN (:...isins)", { isins })
      .orderBy("stock.isin")
      .addOrderBy("hq.date", "DESC")
      .getMany();

    return latestQuotes.reduce((acc, quote) => {
      const mapped = this.mapToLatestQuoteDTO(quote);
      if (mapped) {
        const { isin, date, price } = mapped;
        acc[isin] = { date, price };
      }
      return acc;
    }, {} as AllLatestQuotesResponseDTO);
  }

  async findOne(id: string): Promise<HistoricalQuote | null> {
    return this.historicalQuoteRepository.findOne({
      where: { id },
      relations: ["stock"],
    });
  }

  async create(historicalQuote: HistoricalQuote): Promise<HistoricalQuote> {
    return this.historicalQuoteRepository.save(historicalQuote);
  }

  async update(
    id: string,
    historicalQuote: HistoricalQuote,
  ): Promise<HistoricalQuote | null> {
    await this.historicalQuoteRepository.update(id, historicalQuote);
    return this.historicalQuoteRepository.findOne({
      where: { id },
      relations: ["stock"],
    });
  }

  async remove(id: string): Promise<void> {
    await this.historicalQuoteRepository.delete(id);
  }

  private mapToLatestQuoteDTO(
    quote: HistoricalQuote | null,
  ): LatestQuoteResponseDTO | null {
    return quote != null
      ? {
          isin: quote.stock.isin,
          date: new Date(quote.date),
          price: Number(quote.close),
        }
      : null;
  }
}
