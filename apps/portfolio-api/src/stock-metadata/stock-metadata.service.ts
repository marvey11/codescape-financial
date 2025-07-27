import { StockMetadata } from "@codescape-financial/portfolio-data-access";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class StockMetadataService {
  constructor(
    @InjectRepository(StockMetadata)
    private stockMetadataRepository: Repository<StockMetadata>
  ) {}

  async findAll(): Promise<StockMetadata[]> {
    return this.stockMetadataRepository.find({ relations: ["country"] });
  }

  async findOne(id: string): Promise<StockMetadata | null> {
    return this.stockMetadataRepository.findOne({
      where: { id },
      relations: ["country"],
    });
  }

  async create(stockMetadata: StockMetadata): Promise<StockMetadata> {
    return this.stockMetadataRepository.save(stockMetadata);
  }

  async update(
    id: string,
    stockMetadata: StockMetadata
  ): Promise<StockMetadata | null> {
    await this.stockMetadataRepository.update(id, stockMetadata);
    return this.stockMetadataRepository.findOne({
      where: { id },
      relations: ["country"],
    });
  }

  async remove(id: string): Promise<void> {
    await this.stockMetadataRepository.delete(id);
  }
}
