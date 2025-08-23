import {
  FormButtonsComponent,
  Input,
  LabeledFormField,
  Select,
} from "@codescape-financial/core-ui";
import { Controller, useForm } from "react-hook-form";

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

export interface CountrySelectOption {
  id: string;
  name: string;
  countryCode: string;
}

interface StockMetadataFormProps {
  availableCountries: CountrySelectOption[];
  value?: StockFormData;
  onSubmit: (data: StockFormData) => void;
  onCancel: () => void;
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
  value,
  onSubmit,
  onCancel,
}: StockMetadataFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<StockFormData>({
    defaultValues: value ?? {
      isin: "",
      nsin: "",
      name: "",
      currency: "",
      countryId: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-lg bg-white p-4 shadow-md"
    >
      <Controller
        name="isin"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <LabeledFormField id="stock-isin" label="ISIN:">
            <Input
              title="International Securities Identification Number"
              type="text"
              {...field}
            />
          </LabeledFormField>
        )}
      />

      <Controller
        name="nsin"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <LabeledFormField id="stock-nsin" label="NSIN:">
            <Input
              title="National Securities Identification Number"
              type="text"
              {...field}
            />
          </LabeledFormField>
        )}
      />

      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <LabeledFormField id="stock-name" label="Name:">
            <Input type="text" {...field} />
          </LabeledFormField>
        )}
      />

      <Controller
        name="countryId"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <LabeledFormField id="stock-country" label="Country:">
            <Select {...field}>
              <option value="" disabled>
                Select a country...
              </option>
              {availableCountries.map(({ id, countryCode, name }) => (
                <option key={countryCode} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </LabeledFormField>
        )}
      />

      <Controller
        name="currency"
        control={control}
        rules={{
          required: true,
          minLength: 3,
          maxLength: 3,
          pattern: /^[A-Z]{3}$/,
        }}
        render={({ field }) => (
          <LabeledFormField id="stock-currency" label="Currency:">
            <Input
              type="text"
              {...field}
              title="3-letter currency code (e.g., EUR, USD)"
              list="currency-list"
            />
            <datalist id="currency-list">
              {COMMON_CURRENCIES.map((currency) => (
                <option key={currency} value={currency} />
              ))}
            </datalist>
          </LabeledFormField>
        )}
      />

      <FormButtonsComponent
        submitButtonTitle={
          isSubmitting ? "Saving..." : value ? "Save Changes" : "Add Stock"
        }
        disableSubmitButton={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
