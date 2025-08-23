import { formatNormalizedDate } from "@codescape-financial/core";
import {
  CreateBuyTransactionDTO,
  CreateDividendDTO,
  CreateSellTransactionDTO,
  CreateStockSplitDTO,
  OperationType,
} from "@codescape-financial/portfolio-data-models";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAxios } from "../../../../hooks";
import {
  buildPortfolioDetailsRoute,
  buildPortfolioHoldingDetailsRoute,
} from "../../../../utils";
import { OperationForm, OperationFormData } from "./OperationForm";

type OperationPayloadType =
  | CreateBuyTransactionDTO
  | CreateSellTransactionDTO
  | CreateDividendDTO
  | CreateStockSplitDTO;

export const AddOperationPage = () => {
  const navigate = useNavigate();

  const { portfolioId, holdingId } = useParams();

  const [searchParams] = useSearchParams();

  const stockId = searchParams.get("stockId");

  const { sendRequest: sendOperationRequest } = useAxios();

  const handleSubmit = (data: OperationFormData) => {
    if (!portfolioId || !holdingId || !stockId) {
      return;
    }

    let payload: OperationPayloadType;

    const commonData = {
      portfolioId,
      stockId,
      date: formatNormalizedDate(data.date),
    };

    switch (data.type) {
      case OperationType.BUY:
        payload = {
          ...commonData,
          shares: data.shares,
          pricePerShare: data.pricePerShare,
          fees: data.fees,
        } satisfies CreateBuyTransactionDTO;
        break;

      case OperationType.SELL:
        payload = {
          ...commonData,
          shares: data.shares,
          pricePerShare: data.pricePerShare,
          fees: data.fees,
        } satisfies CreateSellTransactionDTO;
        break;

      case OperationType.DIVIDEND:
        payload = {
          ...commonData,
          applicableShares: data.applicableShares,
          dividendPerShare: data.dividendPerShare,
          exchangeRate: data.exchangeRate,
        } satisfies CreateDividendDTO;
        break;

      case OperationType.STOCK_SPLIT:
        payload = {
          ...commonData,
          splitRatio: data.splitRatio,
        } satisfies CreateStockSplitDTO;
        break;
    }

    sendOperationRequest({
      url: `/portfolio-operations/${endpointMapping[data.type]}`,
      method: "post",
      data: payload,
    }).then(() => {
      navigate(buildPortfolioDetailsRoute(portfolioId));
    });
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Add Operation</h1>

      <OperationForm
        onSubmit={handleSubmit}
        onCancel={() => {
          if (portfolioId && holdingId) {
            navigate(buildPortfolioHoldingDetailsRoute(portfolioId, holdingId));
          }
        }}
      />
    </div>
  );
};

const endpointMapping: { [key in OperationType]: string } = {
  [OperationType.BUY]: "buy",
  [OperationType.SELL]: "sell",
  [OperationType.DIVIDEND]: "dividend",
  [OperationType.STOCK_SPLIT]: "stock-split",
};
