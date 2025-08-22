import { formatNormalizedDate } from "@codescape-financial/core";
import {
  LatestQuoteResponseDTO,
  StockEmbeddedDTO,
  StockResponseDTO,
} from "@codescape-financial/portfolio-data-models";
import { HistoricalQuote, StockMetadata } from "../entities";

export const mapStockMetadataEntityToDto = (
  stock: StockMetadata,
): StockResponseDTO => {
  const { id, isin, nsin, name, currency, country } = stock;
  return {
    id,
    isin,
    nsin,
    name,
    currency,
    country: {
      id: country.id,
      name: country.name,
      countryCode: country.isoCode,
    },
  } satisfies StockResponseDTO;
};

export const mapStockMetadataEntityToEmbeddedDTO = (
  stockMetadata: StockMetadata,
): StockEmbeddedDTO => {
  const { id, isin, nsin, name } = stockMetadata;
  return { id, isin, nsin, name } satisfies StockEmbeddedDTO;
};

export const mapHistoricalToLatestQuoteDTO = (
  quote: HistoricalQuote,
): LatestQuoteResponseDTO =>
  ({
    isin: quote.stock.isin,
    date: formatNormalizedDate(new Date(quote.date)),
    price: Number(quote.close),
  }) satisfies LatestQuoteResponseDTO;
