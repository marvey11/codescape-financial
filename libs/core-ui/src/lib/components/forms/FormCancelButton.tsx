import { Button } from "../Button";

interface Props {
  title?: string;
  onClick: () => void;
}

export const FormCancelButton = ({ title = "Cancel", onClick }: Props) => (
  <Button type="button" onClick={onClick} variant="secondary">
    {title}
  </Button>
);
