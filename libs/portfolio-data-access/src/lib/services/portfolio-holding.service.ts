import { PortfolioHoldingBaseDTO } from "@codescape-financial/portfolio-data-models";
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

  async findOne(id: string): Promise<PortfolioHoldingBaseDTO | null> {
    return this.holdingRepository
      .findOne({
        where: { id },
        relations: ["portfolio", "stockMetadata", "stockMetadata.country"],
      })
      .then((entity) => (entity ? this.mapEntityToDTO(entity) : null));
  }

  private mapEntityToDTO(entity: PortfolioHolding): PortfolioHoldingBaseDTO {
    return {
      id: entity.id,
      portfolioId: entity.portfolioId,
      stock: {
        id: entity.stockMetadata.id,
        name: entity.stockMetadata.name,
        isin: entity.stockMetadata.isin,
        nsin: entity.stockMetadata.nsin,
      },
    };
  }
}
