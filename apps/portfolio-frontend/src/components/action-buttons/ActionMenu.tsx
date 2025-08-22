import { ActionButton, cn } from "@codescape-financial/core-ui";
import { ReactNode } from "react";
import { Icon } from "../icons";

interface ActionMenuProps {
  children: ReactNode;
}

export const ActionMenu = ({ children }: ActionMenuProps) => {
  return (
    // 'group' class is essential to enable group-hover utilities on children
    <div className="group relative inline-flex">
      {/* Main button - always visible */}
      <ActionButton aria-label="More options">
        <Icon name="MoreOptions" aria-hidden="true" />
      </ActionButton>

      {/* Expanded menu container - hidden by default, visible on group hover */}
      <div
        className={cn(
          "absolute top-0 mr-1 flex flex-row items-center gap-1",
          "invisible opacity-0 group-hover:visible group-hover:bg-white group-hover:opacity-100",
          "z-10 transition-all duration-200 ease-out",
          "right-full",
        )}
      >
        {children}
      </div>
    </div>
  );
};
