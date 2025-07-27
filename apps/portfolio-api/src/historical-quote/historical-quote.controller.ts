import {
  HistoricalQuote,
  HistoricalQuoteService,
} from "@codescape-financial/portfolio-data-access";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

@Controller("historical-quotes")
export class HistoricalQuoteController {
  constructor(
    private readonly historicalQuoteService: HistoricalQuoteService
  ) {}

  @Get()
  async findAll(): Promise<HistoricalQuote[]> {
    return this.historicalQuoteService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<HistoricalQuote | null> {
    return this.historicalQuoteService.findOne(id);
  }

  @Post()
  async create(
    @Body() historicalQuote: HistoricalQuote
  ): Promise<HistoricalQuote> {
    return this.historicalQuoteService.create(historicalQuote);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() historicalQuote: HistoricalQuote
  ): Promise<HistoricalQuote | null> {
    return this.historicalQuoteService.update(id, historicalQuote);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    await this.historicalQuoteService.remove(id);
  }
}
