import { formatNormalizedDate } from "@codescape-financial/core";
import { FormRow, Input, Select } from "@codescape-financial/core-ui";
import { OperationType } from "@codescape-financial/portfolio-data-models";

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

interface Props {
  value: OperationFormData;
  onChange: (data: OperationFormData) => void;
}

export const OperationForm = ({ value, onChange }: Props) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value: inputValue, type } = e.target;

    let processedValue: string | number | Date = inputValue;

    if (type === "number") {
      processedValue = inputValue === "" ? 0 : parseFloat(inputValue);
    } else if (type === "date") {
      processedValue = new Date(inputValue + "T00:00:00");
    }

    onChange({
      ...value,
      [name]: processedValue,
    });
  };

  return (
    <>
      <FormRow label={<label htmlFor="operation-type">Operation Type:</label>}>
        <Select
          id="operation-type"
          name="type"
          value={value.type}
          onChange={handleChange}
          required
        >
          {Object.values(OperationType).map((type) => (
            <option key={type} value={type}>
              {selectLabelMapping[type]}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow label={<label htmlFor="operation-date">Date:</label>}>
        <Input
          id="operation-date"
          name="date"
          value={formatNormalizedDate(value.date)}
          onChange={handleChange}
          type="date"
        />
      </FormRow>

      {
        {
          [OperationType.BUY]: (
            <TransactionFormFields value={value} handleChange={handleChange} />
          ),
          [OperationType.SELL]: (
            <TransactionFormFields value={value} handleChange={handleChange} />
          ),
          [OperationType.DIVIDEND]: (
            <DividendFormFields value={value} handleChange={handleChange} />
          ),
          [OperationType.STOCK_SPLIT]: (
            <StockSplitFormFields value={value} handleChange={handleChange} />
          ),
        }[value.type]
      }
    </>
  );
};

interface FormFieldProps {
  value: OperationFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TransactionFormFields = ({ value, handleChange }: FormFieldProps) => (
  <>
    <FormRow label={<label htmlFor="operation-shares">Shares:</label>}>
      <Input
        id="operation-shares"
        name="shares"
        value={value.shares}
        onChange={handleChange}
        type="number"
        min={0}
        step={0.0001}
        required
      />
    </FormRow>

    <FormRow
      label={
        <label htmlFor="operation-price-per-share">Price Per Share:</label>
      }
    >
      <Input
        id="operation-price-per-share"
        name="pricePerShare"
        value={value.pricePerShare}
        onChange={handleChange}
        type="number"
        min={0}
        step={0.0001}
        required
      />
    </FormRow>

    <FormRow label={<label htmlFor="operation-fees">Fees:</label>}>
      <Input
        id="operation-fees"
        name="fees"
        value={value.fees}
        onChange={handleChange}
        type="number"
        min={0}
        step={0.0001}
        required
      />
    </FormRow>
  </>
);

const DividendFormFields = ({ value, handleChange }: FormFieldProps) => (
  <>
    <FormRow
      label={
        <label htmlFor="operation-dividend-per-share">
          Dividend Per Share:
        </label>
      }
    >
      <Input
        id="operation-dividend-per-share"
        name="dividendPerShare"
        value={value.dividendPerShare}
        onChange={handleChange}
        type="number"
        min={0}
        step={0.0001}
        required
      />
    </FormRow>

    <FormRow
      label={
        <label htmlFor="operation-applicable-shares">Applicable Shares:</label>
      }
    >
      <Input
        id="operation-applicable-shares"
        name="applicableShares"
        value={value.applicableShares}
        onChange={handleChange}
        type="number"
        min={0}
        step={0.0001}
        required
      />
    </FormRow>

    <FormRow
      label={<label htmlFor="operation-exchange-rate">Exchange Rate:</label>}
    >
      <Input
        id="operation-exchange-rate"
        name="exchangeRate"
        value={value.exchangeRate}
        onChange={handleChange}
        type="number"
        min={0}
        step={0.0001}
        required
      />
    </FormRow>
  </>
);

const StockSplitFormFields = ({ value, handleChange }: FormFieldProps) => (
  <FormRow label={<label htmlFor="operation-split-ratio">Split Ratio:</label>}>
    <Input
      id="operation-split-ratio"
      name="splitRatio"
      value={value.splitRatio}
      onChange={handleChange}
      type="number"
      min={0}
      step={0.0001}
      required
    />
  </FormRow>
);

const selectLabelMapping: { [key in OperationType]: string } = {
  [OperationType.BUY]: "Buy Shares",
  [OperationType.SELL]: "Sell Shares",
  [OperationType.DIVIDEND]: "Dividend Payment",
  [OperationType.STOCK_SPLIT]: "Stock Split",
};
