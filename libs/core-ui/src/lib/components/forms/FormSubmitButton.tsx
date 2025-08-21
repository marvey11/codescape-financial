import { useMemo } from "react";
import { Button } from "../Button";

interface Props {
  title?: string;
  disabled?: boolean | (() => boolean) | undefined;
}

export const FormSubmitButton = ({ title = "Save", disabled }: Props) => {
  const isDisabled = useMemo(
    () => (typeof disabled === "function" ? disabled() : disabled),
    [disabled],
  );
  return (
    <Button type="submit" disabled={isDisabled}>
      {title}
    </Button>
  );
};
