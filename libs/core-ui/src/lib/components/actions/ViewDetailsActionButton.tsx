import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { ActionButton } from "./ActionButton";

interface Props {
  label?: string;
  onClick?: (() => void) | undefined;
}

export const ViewDetailsActionButton = ({
  label = "Show details",
  onClick,
}: Props) => (
  <ActionButton aria-label={label} onClick={onClick}>
    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
  </ActionButton>
);
