import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HistoricalQuote } from "../entities/index.js";

@Injectable()
export class HistoricalQuoteService {
  constructor(
    @InjectRepository(HistoricalQuote)
    private historicalQuoteRepository: Repository<HistoricalQuote>
  ) {}

  async findAll(): Promise<HistoricalQuote[]> {
    return this.historicalQuoteRepository.find({ relations: ["stock"] });
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
    historicalQuote: HistoricalQuote
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
}
