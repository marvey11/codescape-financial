import { StockMetadata } from "@codescape-financial/portfolio-data-access";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { StockMetadataService } from "./stock-metadata.service.js";

@Controller("stock-metadata")
export class StockMetadataController {
  constructor(private readonly stockMetadataService: StockMetadataService) {}

  @Get()
  async findAll(): Promise<StockMetadata[]> {
    return this.stockMetadataService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<StockMetadata | null> {
    return this.stockMetadataService.findOne(id);
  }

  @Post()
  async create(@Body() stockMetadata: StockMetadata): Promise<StockMetadata> {
    return this.stockMetadataService.create(stockMetadata);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() stockMetadata: StockMetadata
  ): Promise<StockMetadata | null> {
    return this.stockMetadataService.update(id, stockMetadata);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    await this.stockMetadataService.remove(id);
  }
}
