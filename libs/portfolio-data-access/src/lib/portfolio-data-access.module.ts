import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Portfolio,
  PortfolioBuyTransaction,
  PortfolioHolding,
  PortfolioOperation,
} from "./entities/index";
import { PortfolioOperationService, PortfolioService } from "./services/index";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portfolio,
      PortfolioBuyTransaction,
      PortfolioHolding,
      PortfolioOperation,
    ]),
  ],
  providers: [PortfolioOperationService, PortfolioService],
  exports: [PortfolioOperationService, PortfolioService, TypeOrmModule],
})
export class PortfolioDataAccessModule {}
