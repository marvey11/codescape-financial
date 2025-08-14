import {
  PortfolioCalculationService,
  PortfolioService,
} from "@codescape-financial/portfolio-data-access";
import {
  BatchISINRequestDTO,
  CreatePortfolioDTO,
  PortfolioViewFilterDTO,
  UpdatePortfolioDTO,
  XIRRPortfolioResponseDTO,
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

@Controller("portfolios")
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly portfolioCalculationService: PortfolioCalculationService,
  ) {}

  @Get()
  async getAll() {
    return this.portfolioService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.portfolioService.findOne(id);
  }

  @Post()
  async createPortfolio(@Body() dto: CreatePortfolioDTO) {
    return this.portfolioService.create(dto);
  }

  @Put(":id")
  async updatePortfolio(
    @Param("id") id: string,
    @Body() dto: UpdatePortfolioDTO,
  ) {
    return this.portfolioService.update(id, dto);
  }

  @Delete(":id")
  async deletePortfolio(@Param("id") id: string) {
    return this.portfolioService.remove(id);
  }

  @Get(":id/xirr")
  async getPortfolioXirr(
    @Param("id") portfolioId: string,
    @Query() filter: PortfolioViewFilterDTO,
  ): Promise<XIRRPortfolioResponseDTO | null> {
    console.log("CONTROLLER", filter);
    return this.portfolioCalculationService.calculatePortfolioXIRR(
      portfolioId,
      filter.activeOnly ?? false,
    );
  }

  @Post(":id/xirr-batch")
  async getPortfolioFilteredXirr(
    @Param("id") portfolioId: string,
    @Body() body: BatchISINRequestDTO,
  ): Promise<XIRRPortfolioResponseDTO | null> {
    return this.portfolioCalculationService.calculateBatchXIRRForPortfolio(
      portfolioId,
      body.isins,
    );
  }
}
