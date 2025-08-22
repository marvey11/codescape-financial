import { PortfolioHoldingResponseDTO } from "@codescape-financial/portfolio-data-models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PortfolioHolding } from "../entities";
import { mapPortfolioHoldingEntityToDto } from "../utils";

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
  ): Promise<PortfolioHoldingResponseDTO | null> {
    return this.holdingRepository
      .findOne({
        where: { id: holdingId, portfolioId },
        relations: ["stockMetadata", "operations"],
      })
      .then((res) =>
        res ? mapPortfolioHoldingEntityToDto(res, portfolioId) : null,
      );
  }
}
