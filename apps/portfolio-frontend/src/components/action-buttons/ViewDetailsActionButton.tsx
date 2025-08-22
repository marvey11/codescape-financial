import { ActionButton } from "@codescape-financial/core-ui";
import { Icon } from "../icons";

interface Props {
  label?: string;
  onClick?: (() => void) | undefined;
}

export const ViewDetailsActionButton = ({
  label = "Show details",
  onClick,
}: Props) => (
  <ActionButton aria-label={label} onClick={onClick}>
    <Icon name="ViewDetails" aria-hidden="true" />
  </ActionButton>
);
