import { ReactNode } from "react";

interface Props {
  "aria-label": string;
  onClick: () => void;
  children: ReactNode;
}

export const DetailsActionButton = ({
  "aria-label": ariaLabel,
  onClick,
  children,
}: Props) => {
  return (
    // Using both title and aria-label for better cross-browser/assistive tech support.
    <button title={ariaLabel} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
};
