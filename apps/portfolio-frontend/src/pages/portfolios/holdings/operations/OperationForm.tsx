import { formatNormalizedDate, getDateObject } from "@codescape-financial/core";
import {
  FormButtonsComponent,
  Input,
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
          <>
            <label
              htmlFor="operation-type"
              className="font-medium text-gray-700"
            >
              Operation Type:
            </label>
            <Select id="operation-type" {...field}>
              {Object.values(OperationType).map((type) => (
                <option key={type} value={type}>
                  {selectLabelMapping[type]}
                </option>
              ))}
            </Select>
          </>
        )}
      />

      <Controller
        name="date"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <>
            <label
              htmlFor="operation-date"
              className="font-medium text-gray-700"
            >
              Date:
            </label>
            <Input
              id="operation-date"
              type="date"
              {...field}
              value={formatNormalizedDate(field.value)}
              onChange={(e) => field.onChange(getDateObject(e.target.value))}
            />
          </>
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
        <>
          <label
            htmlFor="operation-shares"
            className="font-medium text-gray-700"
          >
            Shares:
          </label>
          <Input id="operation-shares" type="number" step={0.001} {...field} />
        </>
      )}
    />

    <Controller
      name="pricePerShare"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <>
          <label
            htmlFor="operation-price-per-share"
            className="font-medium text-gray-700"
          >
            Price Per Share:
          </label>
          <Input
            id="operation-price-per-share"
            type="number"
            step={0.0001}
            {...field}
          />
        </>
      )}
    />

    <Controller
      name="fees"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <>
          <label htmlFor="operation-fees" className="font-medium text-gray-700">
            Fees:
          </label>
          <Input id="operation-fees" type="number" step={0.0001} {...field} />
        </>
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
        <>
          <label
            htmlFor="operation-dividend-per-share"
            className="font-medium text-gray-700"
          >
            Dividend Per Share:
          </label>
          <Input
            id="operation-dividend-per-share"
            type="number"
            step={0.0001}
            {...field}
          />
        </>
      )}
    />

    <Controller
      name="applicableShares"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <>
          <label
            htmlFor="operation-applicable-shares"
            className="font-medium text-gray-700"
          >
            Applicable Shares:
          </label>
          <Input
            id="operation-applicable-shares"
            type="number"
            step={0.0001}
            {...field}
          />
        </>
      )}
    />

    <Controller
      name="exchangeRate"
      control={control}
      rules={{ required: true, min: 0 }}
      render={({ field }) => (
        <>
          <label
            htmlFor="operation-exchange-rate"
            className="font-medium text-gray-700"
          >
            Exchange Rate:
          </label>
          <Input
            id="operation-exchange-rate"
            type="number"
            step={0.0001}
            {...field}
          />
        </>
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
      <>
        <label
          htmlFor="operation-split-ratio"
          className="font-medium text-gray-700"
        >
          Split Ratio:
        </label>
        <Input
          id="operation-split-ratio"
          type="number"
          step={0.0001}
          {...field}
        />
      </>
    )}
  />
);

const selectLabelMapping: { [key in OperationType]: string } = {
  [OperationType.BUY]: "Buy Shares",
  [OperationType.SELL]: "Sell Shares",
  [OperationType.DIVIDEND]: "Dividend Payment",
  [OperationType.STOCK_SPLIT]: "Stock Split",
};
