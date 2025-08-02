import { FormRow, Input, Select } from "@codescape-financial/core-ui";
import { CountryResponseDTO } from "@codescape-financial/portfolio-data-models";
import React from "react";

/**
 * Represents all the parameters that can be modified in this form.
 *
 * Can be both incoming (edit form) and outgoing data (add and edit).
 */
export interface StockFormData {
  isin: string;
  nsin: string;
  name: string;
  currency: string;
  countryId: string;
}

interface StockMetadataFormProps {
  availableCountries: CountryResponseDTO[];
  value?: StockFormData;
  onChange: (data: StockFormData) => void;
}

const COMMON_CURRENCIES = [
  "AUD", // Australian Dollar
  "CAD", // Canadian Dollar
  "CHF", // Swiss Franc
  "DKK", // Danish Krone
  "EUR", // Euro
  "GBP", // British Pound Sterling
  "JPY", // Japanese Yen
  "NOK", // Norwegian Krone
  "SEK", // Swedish Krona
  "USD", // United States Dollar
];

export const StockMetadataForm = ({
  availableCountries,
  value = {
    isin: "",
    nsin: "",
    name: "",
    currency: "",
    countryId: "",
  },
  onChange,
}: StockMetadataFormProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value: inputValue } = e.target;

    onChange({
      ...value,
      [name]: name === "currency" ? inputValue.toUpperCase() : inputValue,
    });
  };

  return (
    <>
      <FormRow label={<label htmlFor="stock-isin">ISIN:</label>}>
        <Input
          id="stock-isin"
          name="isin"
          value={value.isin}
          onChange={handleChange}
          type="text"
          required
        />
      </FormRow>

      <FormRow label={<label htmlFor="stock-nsin">NSIN:</label>}>
        <Input
          id="stock-nsin"
          name="nsin"
          value={value.nsin}
          onChange={handleChange}
          type="text"
          required
        />
      </FormRow>

      <FormRow label={<label htmlFor="stock-name">Name:</label>}>
        <Input
          id="stock-name"
          name="name"
          value={value.name}
          onChange={handleChange}
          type="text"
          required
        />
      </FormRow>

      <FormRow label={<label htmlFor="stock-country">Country:</label>}>
        <Select
          id="stock-country"
          name="countryId"
          value={value.countryId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a country...
          </option>
          {availableCountries.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow label={<label htmlFor="stock-currency">Currency:</label>}>
        <Input
          id="stock-currency"
          name="currency"
          value={value.currency}
          onChange={handleChange}
          list="currency-list"
          type="text"
          required
          minLength={3}
          maxLength={3}
          pattern="[A-Z]{3}"
          title="3-letter currency code (e.g., EUR, USD)"
        />
        <datalist id="currency-list">
          {COMMON_CURRENCIES.map((currency) => (
            <option key={currency} value={currency} />
          ))}
        </datalist>
      </FormRow>
    </>
  );
};
