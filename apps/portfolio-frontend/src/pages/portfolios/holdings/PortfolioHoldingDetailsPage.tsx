import { Button } from "@codescape-financial/core-ui";
import { PortfolioHoldingTransformedDTO } from "@codescape-financial/portfolio-data-models";
import { Link } from "react-router-dom";
import {
  DataPageContainer,
  DetailsPageHeader,
  OperationTimeline,
} from "../../../components";
import { useOutletContextData } from "../../../hooks";
import {
  buildAddOperationRoute,
  buildPortfolioDetailsRoute,
} from "../../../utils";

export const PortfolioHoldingDetailsPage = () => {
  const {
    loading,
    error,
    data: holding,
  } = useOutletContextData<PortfolioHoldingTransformedDTO>();

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {holding && (
        <div className="flex flex-col gap-3">
          <DetailsPageHeader
            title={`${holding.stock.name} — Holding Details`}
            extraComponents={[
              <Link
                to={buildAddOperationRoute(
                  holding.portfolioId,
                  holding.id,
                  holding.stock.id,
                )}
              >
                <Button>Add Operation</Button>
              </Link>,
              <Link to={buildPortfolioDetailsRoute(holding.portfolioId)}>
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
