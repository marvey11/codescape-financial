import { formatNormalizedDate } from "@codescape-financial/core";
import { FormButtonsComponent } from "@codescape-financial/core-ui";
import {
  CreateBuyTransactionDTO,
  CreateDividendDTO,
  CreateSellTransactionDTO,
  CreateStockSplitDTO,
  OperationType,
} from "@codescape-financial/portfolio-data-models";
import { FormEvent, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAxios } from "../../../../hooks";
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

  const [formData, setFormData] = useState<OperationFormData>({
    type: OperationType.BUY,
    date: new Date(),
    shares: 0,
    pricePerShare: 0,
    fees: 0,
    applicableShares: 0,
    dividendPerShare: 0,
    exchangeRate: 1,
    splitRatio: 1,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!portfolioId || !holdingId || !stockId) {
      return;
    }

    let payload: OperationPayloadType;

    const commonData = {
      portfolioId,
      stockId,
      date: formatNormalizedDate(formData.date),
    };

    switch (formData.type) {
      case OperationType.BUY:
        payload = {
          ...commonData,
          shares: formData.shares,
          pricePerShare: formData.pricePerShare,
          fees: formData.fees,
        } satisfies CreateBuyTransactionDTO;
        break;

      case OperationType.SELL:
        payload = {
          ...commonData,
          shares: formData.shares,
          pricePerShare: formData.pricePerShare,
          fees: formData.fees,
        } satisfies CreateSellTransactionDTO;
        break;

      case OperationType.DIVIDEND:
        payload = {
          ...commonData,
          applicableShares: formData.applicableShares,
          dividendPerShare: formData.dividendPerShare,
          exchangeRate: formData.exchangeRate,
        } satisfies CreateDividendDTO;
        break;

      case OperationType.STOCK_SPLIT:
        payload = {
          ...commonData,
          splitRatio: formData.splitRatio,
        } satisfies CreateStockSplitDTO;
        break;
    }

    sendOperationRequest({
      url: `/portfolio-operations/${endpointMapping[formData.type]}`,
      method: "post",
      data: payload,
    }).then(() => {
      navigate(`/portfolios/${portfolioId}`);
    });
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-4xl font-extrabold">Add Operation</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-md border border-gray-300 p-6 shadow-sm"
      >
        <OperationForm value={formData} onChange={setFormData} />

        <FormButtonsComponent
          onCancel={() => {
            navigate(`/portfolios/${portfolioId}`, { replace: true });
          }}
        />
      </form>
    </div>
  );
};

const endpointMapping: { [key in OperationType]: string } = {
  [OperationType.BUY]: "buy",
  [OperationType.SELL]: "sell",
  [OperationType.DIVIDEND]: "dividend",
  [OperationType.STOCK_SPLIT]: "stock-split",
};
