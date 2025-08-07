import { PortfolioOperationService } from "@codescape-financial/portfolio-data-access";
import {
  CreateBuyTransactionDTO,
  CreateDividendDTO,
  CreateSellTransactionDTO,
  CreateStockSplitDTO,
} from "@codescape-financial/portfolio-data-models";
import { Body, Controller, Get, Post } from "@nestjs/common";

@Controller("portfolio-operations")
export class PortfolioOperationController {
  constructor(
    private readonly portfolioOperationService: PortfolioOperationService,
  ) {}

  @Get()
  async getOperations() {
    return this.portfolioOperationService.findAll();
  }

  @Post("buy")
  async applyBuyOperation(@Body() data: CreateBuyTransactionDTO) {
    return this.portfolioOperationService.createBuyOperation(data);
  }

  @Post("sell")
  async applySellOperation(@Body() data: CreateSellTransactionDTO) {
    return this.portfolioOperationService.createSellOperation(data);
  }

  @Post("stock-split")
  async applyStockSplitOperation(@Body() data: CreateStockSplitDTO) {
    return this.portfolioOperationService.createStockSplitOperation(data);
  }

  @Post("dividend")
  async applyDividendOperation(@Body() data: CreateDividendDTO) {
    return this.portfolioOperationService.createDividendOperation(data);
  }
}
