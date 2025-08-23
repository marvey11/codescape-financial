import { formatNormalizedDate, getDateObject } from "@codescape-financial/core";
import {
  FormButtonsComponent,
  Input,
  LabeledFormField,
  Select,
} from "@codescape-financial/core-ui";
import { OperationType } from "@codescape-financial/portfolio-data-models";
import { Control, Controller, useForm, useWatch } from "react-hook-form";

export interface OperationFormData {
  type: OperationType;
  date: Date;
  shares: number;
  pricePerShare: number;
  fees: number;
  applicableShares: number;
  dividendPerShare: number;
  exchangeRate: number;
  splitRatio: number;
}

interface OperationFormProps {
  value?: OperationFormData;
  onSubmit: (data: OperationFormData) => void;
  onCancel: () => void;
}

export const OperationForm = ({
  value,
  onSubmit,
  onCancel,
}: OperationFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<OperationFormData>({
    defaultValues: value ?? {
      type: OperationType.BUY,
      date: new Date(),
      shares: 0,
      pricePerShare: 0,
      fees: 0,
      applicableShares: 0,
      dividendPerShare: 0,
      exchangeRate: 1,
      splitRatio: 1,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-lg bg-white p-4 shadow-md"
    >
      <Controller
        name="type"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <LabeledFormField id="operation-type" label="Operation Type:">
            <Select {...field}>
              {Object.values(OperationType).map((type) => (
                <option key={type} value={type}>
                  {selectLabelMapping[type]}
                </option>
              ))}
            </Select>
          </LabeledFormField>
        )}
      />

      <Controller
        name="date"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <LabeledFormField id="operation-date" label="Date:">
            <Input
              type="date"
              {...field}
              value={formatNormalizedDate(field.value)}
              onChange={(e) => field.onChange(getDateObject(e.target.value))}
            />
          </LabeledFormField>
        )}
      />

      <OperationFormFields control={control} />

      <FormButtonsComponent
        submitButtonTitle={
          isSubmitting ? "Saving..." : value ? "Save Changes" : "Add Operation"
        }
        disableSubmitButton={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};

interface FormFieldProps {
  control: Control<OperationFormData>;
}

const OperationFormFields = ({ control }: FormFieldProps) => {
  const type = useWatch({
    control,
    name: "type",
  });

  switch (type) {
    case OperationType.BUY:
    case OperationType.SELL:
      return <TransactionFormFields control={control} />;
    case OperationType.DIVIDEND:
      return <DividendFormFields control={control} />;
    case OperationType.STOCK_SPLIT:
      return <StockSplitFormFields control={control} />;
    default:
      return null;
  }
};

const TransactionFormFields = ({ control }: FormFieldProps) => (
  <>
    <Controller
      name="shares"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <LabeledFormField id="operation-shares" label="Shares:">
          <Input
            type="number"
            step={0.001}
            {...field}
            // Manually handle onChange to convert the value to a number
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        </LabeledFormField>
      )}
    />

    <Controller
      name="pricePerShare"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <LabeledFormField
          id="operation-price-per-share"
          label="Price per Share:"
        >
          <Input
            type="number"
            step={0.0001}
            {...field}
            // Manually handle onChange to convert the value to a number
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        </LabeledFormField>
      )}
    />

    <Controller
      name="fees"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <LabeledFormField id="operation-fees" label="Fees:">
          <Input
            type="number"
            step={0.0001}
            {...field}
            // Manually handle onChange to convert the value to a number
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        </LabeledFormField>
      )}
    />
  </>
);

const DividendFormFields = ({ control }: FormFieldProps) => (
  <>
    <Controller
      name="dividendPerShare"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <LabeledFormField
          id="operation-dividend-per-share"
          label="Dividend per Share:"
        >
          <Input
            type="number"
            step={0.0001}
            {...field}
            // Manually handle onChange to convert the value to a number
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        </LabeledFormField>
      )}
    />

    <Controller
      name="applicableShares"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <LabeledFormField
          id="operation-applicable-shares"
          label="Applicable Shares:"
        >
          <Input
            type="number"
            step={0.0001}
            {...field}
            // Manually handle onChange to convert the value to a number
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        </LabeledFormField>
      )}
    />

    <Controller
      name="exchangeRate"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <LabeledFormField id="operation-exchange-rate" label="Exchange Rate:">
          <Input
            type="number"
            step={0.0001}
            {...field}
            // Manually handle onChange to convert the value to a number
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        </LabeledFormField>
      )}
    />
  </>
);

const StockSplitFormFields = ({ control }: FormFieldProps) => (
  <Controller
    name="splitRatio"
    control={control}
    rules={{ required: true, min: 0 }}
    render={({ field }) => (
      <LabeledFormField id="operation-split-ratio" label="Split Ratio:">
        <Input
          type="number"
          step={0.0001}
          {...field}
          // Manually handle onChange to convert the value to a number
          onChange={(e) => field.onChange(Number(e.target.value))}
        />
      </LabeledFormField>
    )}
  />
);

const selectLabelMapping: { [key in OperationType]: string } = {
  [OperationType.BUY]: "Buy Shares",
  [OperationType.SELL]: "Sell Shares",
  [OperationType.DIVIDEND]: "Dividend Payment",
  [OperationType.STOCK_SPLIT]: "Stock Split",
};
