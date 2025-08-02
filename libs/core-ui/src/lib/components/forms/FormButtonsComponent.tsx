import { FormCancelButton } from "./FormCancelButton";
import { FormSubmitButton } from "./FormSubmitButton";

interface Props {
  submitButtonTitle?: string;
  cancelButtonTitle?: string;
  onCancel: () => void;
}

export const FormButtonsComponent = ({
  submitButtonTitle = "Save",
  cancelButtonTitle = "Cancel",
  onCancel,
}: Props) => (
  <div className="col-span-2 flex flex-row items-center justify-end gap-2">
    <FormSubmitButton title={submitButtonTitle} />
    <FormCancelButton title={cancelButtonTitle} onClick={onCancel} />
  </div>
);
