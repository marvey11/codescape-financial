import { HistoricalQuoteService } from "@codescape-financial/historical-data-access";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PortfolioHolding, PortfolioOperation } from "../entities";
import { PortfolioCalculationService } from "./portfolio-calculation.service";

describe("PortfolioCalculationService", () => {
  let service: PortfolioCalculationService;
  let operationRepository: Repository<PortfolioOperation>;
  let holdingRepository: Repository<PortfolioHolding>;
  let historicalQuoteService: HistoricalQuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioCalculationService,
        {
          provide: getRepositoryToken(PortfolioOperation),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PortfolioHolding),
          useClass: Repository,
        },
        {
          provide: HistoricalQuoteService,
          useValue: {
            findLatestByIsin: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PortfolioCalculationService>(
      PortfolioCalculationService,
    );
    operationRepository = module.get<Repository<PortfolioOperation>>(
      getRepositoryToken(PortfolioOperation),
    );
    holdingRepository = module.get<Repository<PortfolioHolding>>(
      getRepositoryToken(PortfolioHolding),
    );
    historicalQuoteService = module.get<HistoricalQuoteService>(
      HistoricalQuoteService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("calculateBatchXIRRForPortfolio", () => {
    it("should return null if no operations are found", async () => {
      jest.spyOn(operationRepository, "find").mockResolvedValue([]);
      const result = await service.calculateBatchXIRRForPortfolio("p1", [
        "isin1",
      ]);
      expect(result).toBeNull();
    });
  });
});
