import { PortfolioService } from "@codescape-financial/portfolio-data-access";
import {
  CreatePortfolioDTO,
  UpdatePortfolioDTO,
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

@Controller("portfolios")
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getPortfolios() {
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
}
