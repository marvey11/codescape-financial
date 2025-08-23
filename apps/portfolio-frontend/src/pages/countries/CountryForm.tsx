import {
  FormButtonsComponent,
  Input,
  LabeledInput,
} from "@codescape-financial/core-ui";
import { Controller, useForm } from "react-hook-form";

export interface CountryFormData {
  name: string;
  countryCode: string;
  withholdingTaxRate: number;
}

interface CountryFormProps {
  value?: CountryFormData;
  onSubmit: (data: CountryFormData) => void;
  onCancel: () => void;
}

export const CountryForm = ({
  value,
  onSubmit,
  onCancel,
}: CountryFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CountryFormData>({
    defaultValues: value ?? {
      name: "",
      countryCode: "",
      withholdingTaxRate: 0,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-lg bg-white p-4 shadow-md"
    >
      {/* controllers... */}

      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <LabeledInput
            id="country-name"
            label="Country Name:"
            type="text"
            {...field}
          />
        )}
      />

      <Controller
        name="countryCode"
        control={control}
        rules={{
          required: true,
          minLength: 2,
          maxLength: 2,
          pattern: /^[A-Z]{2}$/,
        }}
        render={({ field }) => (
          <LabeledInput
            id="country-code"
            label="Country Code:"
            type="text"
            title="2-letter country code (e.g., DE, US)"
            {...field}
          />
        )}
      />

      <Controller
        name="withholdingTaxRate"
        control={control}
        rules={{ required: true, min: 0, max: 1 }}
        render={({ field }) => (
          <>
            <label
              htmlFor="country-withholding-tax-rate"
              className="font-medium text-gray-700"
            >
              Withholding Tax Rate [%]:
            </label>
            <div className="relative flex items-center">
              <Input
                id="country-withholding-tax-rate"
                type="number"
                className="rounded-r-none focus-visible:z-10"
                step="0.05"
                {...field}
                value={field.value * 100}
                onChange={(e) => field.onChange(Number(e.target.value) / 100)}
              />
              <span className="inline-flex h-10 items-center rounded-l-none rounded-r-md border border-l-0 border-slate-300 bg-slate-100 px-3 text-sm font-bold text-slate-600">
                %
              </span>
            </div>
          </>
        )}
      />

      <FormButtonsComponent
        submitButtonTitle={
          isSubmitting ? "Saving..." : value ? "Save Changes" : "Add Country"
        }
        disableSubmitButton={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
