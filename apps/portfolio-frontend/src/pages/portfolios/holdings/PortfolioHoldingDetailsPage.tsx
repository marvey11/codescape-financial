import { Button } from "@codescape-financial/core-ui";
import { PortfolioHoldingTransformedDTO } from "@codescape-financial/portfolio-data-models";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import {
  DataPageContainer,
  DetailsPageHeader,
  OperationTimeline,
} from "../../../components";
import { useOutletContextData } from "../../../hooks";

export const PortfolioHoldingDetailsPage = () => {
  const {
    loading,
    error,
    data: holding,
  } = useOutletContextData<PortfolioHoldingTransformedDTO>();

  const getQueryString = useCallback(
    (data: PortfolioHoldingTransformedDTO) =>
      new URLSearchParams({
        stockId: data.stock.id,
      }).toString(),
    [],
  );

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {holding && (
        <div className="flex flex-col gap-3">
          <DetailsPageHeader
            title={`${holding.stock.name} — Holding Details`}
            extraComponents={[
              <Link
                to={`/portfolios/${holding.portfolioId}/holdings/${holding.id}/operations/add?${getQueryString(holding)}`}
              >
                <Button>Add Operation</Button>
              </Link>,
              <Link to={`/portfolios/${holding.portfolioId}`}>
                <Button variant="secondary">View Portfolio</Button>
              </Link>,
            ]}
          />

          <OperationTimeline operations={holding.operations} />
        </div>
      )}
    </DataPageContainer>
  );
};
