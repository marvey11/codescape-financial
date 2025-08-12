import { FormRow, Input } from "@codescape-financial/core-ui";

export interface PortfolioFormData {
  name: string;
  description: string;
}

interface PortfolioFormProps {
  value?: PortfolioFormData;
  onChange: (data: PortfolioFormData) => void;
}

export const PortfolioForm = ({
  value = { name: "", description: "" },
  onChange,
}: PortfolioFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: rawValue } = e.target;
    const finalValue: string = rawValue;

    onChange({
      ...value,
      [name]: finalValue,
    });
  };

  return (
    <>
      <FormRow label={<label htmlFor="portfolio-name">Name:</label>}>
        <Input
          id="portfolio-name"
          name="name"
          value={value.name}
          onChange={handleChange}
          type="text"
          required
        />
      </FormRow>

      <FormRow
        label={<label htmlFor="portfolio-description">Description:</label>}
      >
        <Input
          id="portfolio-description"
          name="description"
          value={value.description}
          onChange={handleChange}
          type="text"
        />
      </FormRow>
    </>
  );
};
