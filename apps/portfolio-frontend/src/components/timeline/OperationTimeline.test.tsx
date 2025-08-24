import { getDateObject } from "@codescape-financial/core";
import {
  OperationType,
  PortfolioOperationTransformedDTO,
} from "@codescape-financial/portfolio-data-models";
import { render, screen } from "@testing-library/react";
import { OperationTimeline } from "./OperationTimeline";

describe("OperationTimeline", () => {
  const mockOperations: PortfolioOperationTransformedDTO[] = [
    {
      id: "op1",
      type: OperationType.BUY,
      date: getDateObject("2023-01-15"),
      shares: 10,
      pricePerShare: 100,
      fees: 5,
      taxes: 0,
      applicableShares: 0,
      dividendPerShare: 0,
      exchangeRate: 0,
      splitRatio: 0,
    },
    {
      id: "op2",
      type: OperationType.DIVIDEND,
      date: getDateObject("2023-03-01"),
      applicableShares: 10,
      dividendPerShare: 2,
      taxes: 0.5,
      exchangeRate: 1,
      shares: 0,
      pricePerShare: 0,
      fees: 0,
      splitRatio: 0,
    },
    {
      id: "op3",
      type: OperationType.SELL,
      date: getDateObject("2023-05-20"),
      shares: 5,
      pricePerShare: 120,
      fees: 3,
      taxes: 1,
      applicableShares: 0,
      dividendPerShare: 0,
      exchangeRate: 0,
      splitRatio: 0,
    },
    {
      id: "op4",
      type: OperationType.STOCK_SPLIT,
      date: getDateObject("2023-07-10"),
      splitRatio: 2,
      applicableShares: 0,
      dividendPerShare: 0,
      taxes: 0,
      exchangeRate: 0,
      shares: 0,
      pricePerShare: 0,
      fees: 0,
    },
  ];

  it("renders all operation cards", () => {
    render(<OperationTimeline operations={mockOperations} />);
    expect(
      screen.getByRole("heading", { name: "Buy", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sell", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Dividend", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Stock Split", level: 3 }),
    ).toBeInTheDocument();
  });

  it("renders operation dates", () => {
    render(<OperationTimeline operations={mockOperations} />);
    expect(screen.getByText("15/01/2023")).toBeInTheDocument();
    expect(screen.getByText("01/03/2023")).toBeInTheDocument();
    expect(screen.getByText("20/05/2023")).toBeInTheDocument();
    expect(screen.getByText("10/07/2023")).toBeInTheDocument();
  });

  it("alternates card and date positions", () => {
    render(<OperationTimeline operations={mockOperations} />);

    const buyCard = screen
      .getByRole("heading", { name: "Buy", level: 3 })
      .closest(".flex-row-reverse");
    const dividendCard = screen
      .getByRole("heading", { name: "Dividend", level: 3 })
      .closest(".flex-row");
    const sellCard = screen
      .getByRole("heading", { name: "Sell", level: 3 })
      .closest(".flex-row-reverse");
    const stockSplitCard = screen
      .getByRole("heading", {
        name: "Stock Split",
        level: 3,
      })
      .closest(".flex-row");

    expect(buyCard).toBeInTheDocument();
    expect(dividendCard).toBeInTheDocument();
    expect(sellCard).toBeInTheDocument();
    expect(stockSplitCard).toBeInTheDocument();
  });

  it("renders correct icons for each operation type", () => {
    render(<OperationTimeline operations={mockOperations} />);

    expect(screen.getByTestId("testid-icon-buy-operation")).toBeInTheDocument();
    expect(
      screen.getByTestId("testid-icon-sell-operation"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("testid-icon-dividend-operation"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("testid-icon-stock-split-operation"),
    ).toBeInTheDocument();
  });
});
