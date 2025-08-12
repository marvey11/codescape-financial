import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PortfolioHolding } from "../entities";

@Injectable()
export class PortfolioHoldingService {
  constructor(
    @InjectRepository(PortfolioHolding)
    private readonly holdingRepository: Repository<PortfolioHolding>,
  ) {}

  async findAllByPortfolio(portfolioId: string): Promise<PortfolioHolding[]> {
    return this.holdingRepository.find({ where: { portfolioId } });
  }

  async findOne(
    portfolioId: string,
    holdingId: string,
  ): Promise<PortfolioHolding | null> {
    return this.holdingRepository.findOne({
      where: { id: holdingId, portfolioId },
    });
  }
}
