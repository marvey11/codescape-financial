import { parseNumberWithAutoLocale } from "@codescape-financial/core";
import { FormRow, Input } from "@codescape-financial/core-ui";
import React from "react";

/**
 * Represents all the parameters that can be modified in this form.
 *
 * Can be both incoming (edit form) and outgoing data (add and edit).
 */
export interface CountryFormData {
  name: string;
  countryCode: string;
  withholdingTaxRate: number;
}

interface CountryFormProps {
  value?: CountryFormData;
  onChange: (data: CountryFormData) => void;
}

export const CountryForm = ({
  value = { name: "", countryCode: "", withholdingTaxRate: 0 },
  onChange,
}: CountryFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: rawValue, type } = e.target;
    let finalValue: string | number = rawValue;

    if (name === "countryCode") {
      finalValue = rawValue.toUpperCase();
    } else if (type === "number") {
      // Robustly handle different locale number formats (e.g., "25,5" vs "25.5")
      finalValue = parseNumberWithAutoLocale(rawValue);
      if (e.target.dataset["isPercentage"] === "true") {
        finalValue /= 100;
      }
    }

    onChange({
      ...value,
      [name]: finalValue,
    });
  };

  return (
    <>
      <FormRow label={<label htmlFor="country-name">Name:</label>}>
        <Input
          id="country-name"
          name="name"
          value={value.name}
          onChange={handleChange}
          type="text"
          required
        />
      </FormRow>

      <FormRow label={<label htmlFor="country-code">Country Code:</label>}>
        <Input
          id="country-code"
          name="countryCode"
          value={value.countryCode}
          onChange={handleChange}
          type="text"
          required
          minLength={2}
          maxLength={2}
          pattern="[A-Z]{2}"
          title="2-letter country code (e.g., DE, US)"
        />
      </FormRow>

      <FormRow
        label={
          <label htmlFor="country-withholding-tax-rate">
            Withholding Tax Rate (%):
          </label>
        }
      >
        <div className="relative flex items-center">
          <Input
            id="country-withholding-tax-rate"
            name="withholdingTaxRate"
            value={value.withholdingTaxRate * 100}
            onChange={handleChange}
            type="number"
            className="rounded-r-none focus-visible:z-10"
            required
            min="0"
            max="100"
            step="0.05"
            data-is-percentage="true"
          />
          <span className="inline-flex h-10 items-center rounded-l-none rounded-r-md border border-l-0 border-slate-300 bg-slate-100 px-3 text-sm font-bold text-slate-600">
            %
          </span>
        </div>
      </FormRow>
    </>
  );
};
