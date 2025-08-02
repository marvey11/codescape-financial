import {
  CreateStockDTO,
  StockMetadataFilterDTO,
  StockResponseDTO,
  UpdateStockDTO,
} from "@codescape-financial/portfolio-data-models";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { StockMetadataService } from "./stock-metadata.service.js";

@Controller("stock-metadata")
export class StockMetadataController {
  constructor(private readonly stockMetadataService: StockMetadataService) {}

  @Get()
  async findAll(
    @Query() filter: StockMetadataFilterDTO,
  ): Promise<StockResponseDTO[]> {
    return this.stockMetadataService.findAll(filter);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<StockResponseDTO | null> {
    return this.stockMetadataService.findOne(id);
  }

  @Post()
  async create(@Body() newStockDto: CreateStockDTO): Promise<StockResponseDTO> {
    return this.stockMetadataService.create(newStockDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() stockUpdate: UpdateStockDTO,
  ): Promise<StockResponseDTO> {
    return this.stockMetadataService.update(id, stockUpdate);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    await this.stockMetadataService.remove(id);
  }
}
