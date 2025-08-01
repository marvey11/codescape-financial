import { Button } from "../Button";

interface Props {
  title?: string;
}

export const FormSaveButton = ({ title = "Save" }: Props) => (
  <Button type="submit">{title}</Button>
);
