import {
  HistoricalQuote,
  HistoricalQuoteService,
} from "@codescape-financial/historical-data-access";
import {
  AllLatestQuotesResponseDTO,
  LatestQuoteResponseDTO,
  LatestQuotesRequestDTO,
} from "@codescape-financial/portfolio-data-models";
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
    private readonly historicalQuoteService: HistoricalQuoteService,
  ) {}

  @Get()
  async findAll(): Promise<HistoricalQuote[]> {
    return this.historicalQuoteService.findAll();
  }

  @Get(":isin/latest")
  async findLatestByIsin(
    @Param("isin") isin: string,
  ): Promise<LatestQuoteResponseDTO | null> {
    return this.historicalQuoteService.findLatestByIsin(isin);
  }

  @Post("latest-batch")
  async findLatestByIsins(
    @Body() body: LatestQuotesRequestDTO,
  ): Promise<AllLatestQuotesResponseDTO> {
    return this.historicalQuoteService.findLatestByIsins(body.isins);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<HistoricalQuote | null> {
    return this.historicalQuoteService.findOne(id);
  }

  @Post()
  async create(
    @Body() historicalQuote: HistoricalQuote,
  ): Promise<HistoricalQuote> {
    return this.historicalQuoteService.create(historicalQuote);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() historicalQuote: HistoricalQuote,
  ): Promise<HistoricalQuote | null> {
    return this.historicalQuoteService.update(id, historicalQuote);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    await this.historicalQuoteService.remove(id);
  }
}
