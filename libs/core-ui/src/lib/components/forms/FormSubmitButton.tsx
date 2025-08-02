import { Button } from "../Button";

interface Props {
  title?: string;
}

export const FormSubmitButton = ({ title = "Save" }: Props) => (
  <Button type="submit">{title}</Button>
);
