import {
  Country,
  StockMetadata,
} from "@codescape-financial/historical-data-access";
import {
  CreateStockDTO,
  StockMetadataFilterDTO,
  StockResponseDTO,
  UpdateStockDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class StockMetadataService {
  constructor(
    @InjectRepository(StockMetadata)
    private stockMetadataRepository: Repository<StockMetadata>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAll(filter?: StockMetadataFilterDTO): Promise<StockResponseDTO[]> {
    const where: FindOptionsWhere<StockMetadata> = {};

    if (filter?.countryId) {
      where.country = { id: filter.countryId };
    }

    return this.stockMetadataRepository
      .find({
        relations: ["country"],
        where,
      })
      .then((stocks) => stocks.map(this.mapEntityToDto));
  }

  async findOne(id: string): Promise<StockResponseDTO | null> {
    return this.stockMetadataRepository
      .findOne({
        where: { id },
        relations: ["country"],
      })
      .then((stock) => (stock ? this.mapEntityToDto(stock) : null));
  }

  async create(newStockDto: CreateStockDTO): Promise<StockResponseDTO> {
    const { countryId, ...stockData } = newStockDto;

    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID "${countryId}" not found`);
    }

    const newStock = this.stockMetadataRepository.create({
      ...stockData,
      country,
    });

    const savedStock = await this.stockMetadataRepository.save(newStock);

    return this.mapEntityToDto(savedStock);
  }

  async update(
    id: string,
    stockUpdate: UpdateStockDTO,
  ): Promise<StockResponseDTO> {
    const stockToUpdate = await this.stockMetadataRepository.findOne({
      where: { id },
      relations: ["country"],
    });

    if (!stockToUpdate) {
      throw new NotFoundException(`Stock with ID "${id}" not found`);
    }
    const { countryId, ...stockData } = stockUpdate;
    this.stockMetadataRepository.merge(stockToUpdate, stockData);

    if (countryId && stockToUpdate.country.id !== countryId) {
      const country = await this.countryRepository.findOneBy({ id: countryId });
      if (!country) {
        throw new NotFoundException(`Country with ID "${countryId}" not found`);
      }
      stockToUpdate.country = country;
    }

    const savedStock = await this.stockMetadataRepository.save(stockToUpdate);
    return this.mapEntityToDto(savedStock);
  }

  async remove(id: string): Promise<void> {
    await this.stockMetadataRepository.delete(id);
  }

  private mapEntityToDto(stock: StockMetadata): StockResponseDTO {
    const { id, isin, nsin, name, currency, country } = stock;
    return {
      id,
      isin,
      nsin,
      name,
      currency,
      country: {
        id: country.id,
        name: country.name,
        countryCode: country.isoCode,
      },
    };
  }
}
