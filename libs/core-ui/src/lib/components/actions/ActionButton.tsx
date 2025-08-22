import { ReactNode } from "react";

interface Props {
  "aria-label": string;
  onClick?: (() => void) | undefined;
  children: ReactNode;
}

export const ActionButton = ({
  "aria-label": ariaLabel,
  onClick,
  children,
}: Props) => {
  return (
    // Using both title and aria-label for better cross-browser/assistive tech support.
    <button
      title={ariaLabel}
      aria-label={ariaLabel}
      onClick={onClick}
      className="rounded-lg border border-gray-500 p-[2px]"
    >
      {children}
    </button>
  );
};
