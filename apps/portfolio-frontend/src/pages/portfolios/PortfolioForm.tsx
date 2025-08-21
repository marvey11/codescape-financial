import { FormButtonsComponent, Input } from "@codescape-financial/core-ui";
import { Controller, useForm } from "react-hook-form";

export interface PortfolioFormData {
  name: string;
  description: string;
}

interface PortfolioFormProps {
  value?: PortfolioFormData;
  onSubmit: (data: PortfolioFormData) => void;
  onCancel: () => void;
}

export const PortfolioForm = ({
  value,
  onSubmit,
  onCancel,
}: PortfolioFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<PortfolioFormData>({
    defaultValues: value ?? {
      name: "",
      description: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-[max-content_1fr] items-center gap-4 rounded-lg bg-white p-4 shadow-md"
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <>
            <label
              htmlFor="portfolio-name"
              className="font-medium text-gray-700"
            >
              Portfolio Name:
            </label>
            <Input id="portfolio-name" type="text" {...field} />
          </>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <>
            <label
              htmlFor="portfolio-description"
              className="font-medium text-gray-700"
            >
              Description:
            </label>
            <Input id="portfolio-description" type="text" {...field} />
          </>
        )}
      />

      <FormButtonsComponent
        submitButtonTitle={
          isSubmitting ? "Saving..." : value ? "Save Changes" : "Add Portfolio"
        }
        disableSubmitButton={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};
