import {
  PortfolioCalculationService,
  PortfolioChartService,
  PortfolioService,
} from "@codescape-financial/portfolio-data-access";
import {
  AllocationResponseDTO,
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
    private readonly portfolioChartService: PortfolioChartService,
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
    return this.portfolioCalculationService.calculateXIRRForPortfolioWithCache(
      portfolioId,
      filter.viewType ?? "all",
    );
  }

  @Get(":id/allocations")
  async getPortfolioSummary(
    @Param("id") portfolioId: string,
  ): Promise<AllocationResponseDTO> {
    return this.portfolioChartService.getAllocationChartDataWithCache(
      portfolioId,
    );
  }
}
