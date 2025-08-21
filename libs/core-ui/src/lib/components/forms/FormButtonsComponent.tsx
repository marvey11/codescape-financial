import { FormCancelButton } from "./FormCancelButton";
import { FormSubmitButton } from "./FormSubmitButton";

interface Props {
  submitButtonTitle?: string;
  cancelButtonTitle?: string;
  disableSubmitButton?: boolean | (() => boolean) | undefined;
  onCancel: () => void;
}

export const FormButtonsComponent = ({
  submitButtonTitle = "Save",
  cancelButtonTitle = "Cancel",
  disableSubmitButton,
  onCancel,
}: Props) => (
  <div className="col-span-2 flex flex-row items-center justify-end gap-2">
    <FormSubmitButton
      title={submitButtonTitle}
      disabled={disableSubmitButton}
    />
    <FormCancelButton title={cancelButtonTitle} onClick={onCancel} />
  </div>
);
