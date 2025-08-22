import {
  FormButtonsComponent,
  Input,
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
          <>
            <label htmlFor="stock-isin" className="font-medium text-gray-700">
              ISIN:
            </label>
            <Input id="stock-isin" type="text" {...field} />
          </>
        )}
      />

      <Controller
        name="nsin"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <>
            <label htmlFor="stock-nsin" className="font-medium text-gray-700">
              NSIN:
            </label>
            <Input id="stock-nsin" type="text" {...field} />
          </>
        )}
      />

      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <>
            <label htmlFor="stock-name" className="font-medium text-gray-700">
              Name:
            </label>
            <Input id="stock-name" type="text" {...field} />
          </>
        )}
      />

      <Controller
        name="countryId"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <>
            <label
              htmlFor="stock-country"
              className="font-medium text-gray-700"
            >
              Country:
            </label>
            <Select id="stock-country" {...field}>
              <option value="" disabled>
                Select a country...
              </option>
              {availableCountries.map(({ id, countryCode, name }) => (
                <option key={countryCode} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </>
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
          <>
            <label
              htmlFor="stock-currency"
              className="font-medium text-gray-700"
            >
              Currency:
            </label>
            <Input
              id="stock-currency"
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
          </>
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
