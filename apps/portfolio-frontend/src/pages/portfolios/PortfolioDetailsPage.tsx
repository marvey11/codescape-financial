import { DataTable } from "@codescape-financial/core-ui";
import {
  AllLatestQuotesResponseDTO,
  PortfolioHoldingEmbeddedDTO,
  PortfolioResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { AxiosRequestConfig } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { DataPageContainer, DetailsPageHeader } from "../../components";
import { useOutletContextData } from "../../hooks";
import { buildPortfolioHoldingColumnSchema } from "../../utils";

export const PortfolioDetailsPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: portfolio,
    sendRequest,
  } = useOutletContextData<PortfolioResponseDTO>();

  const handleDelete = () => {
    portfolio &&
      sendRequest({
        url: `/portfolios/${portfolio.id}`,
        method: "delete",
      } satisfies AxiosRequestConfig).then(() => {
        navigate("/portfolios");
      });
  };

  return (
    <DataPageContainer isLoading={loading} error={error}>
      {portfolio && (
        <div className="flex flex-col gap-3">
          <DetailsPageHeader
            title={portfolio.name}
            editPath={`/portfolios/${portfolio.id}/edit`}
            onDelete={handleDelete}
          />

          {portfolio.holdings.length > 0 ? (
            <>
              <h2 className="text-2xl font-extrabold">Holdings</h2>
              <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                <PortfolioHoldingsTable data={portfolio.holdings} />
              </div>
            </>
          ) : (
            <span>No holdings found for this portfolio.</span>
          )}
        </div>
      )}
    </DataPageContainer>
  );
};

const PortfolioHoldingsTable = ({
  data,
}: {
  data: PortfolioHoldingEmbeddedDTO[];
}) => {
  const [latestPrices, setLatestPrices] = useState<AllLatestQuotesResponseDTO>(
    {},
  );

  useEffect(() => {
    const isins = data.map((holding) => holding.stock.isin);
    if (isins.length > 0) {
      axiosInstance
        .post<AllLatestQuotesResponseDTO>("/historical-quotes/latest-batch", {
          isins,
        })
        .then((response) => {
          setLatestPrices(response.data);
        })
        .catch(console.error);
    }
  }, [data]);

  const columns = useMemo(
    () => buildPortfolioHoldingColumnSchema({}, latestPrices),
    // Add `latestPrices` as a dependency to re-calculate columns when prices are fetched.
    [latestPrices],
  );

  return (
    <DataTable<PortfolioHoldingEmbeddedDTO>
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
