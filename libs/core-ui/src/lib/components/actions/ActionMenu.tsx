import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { ReactNode } from "react";
import { cn } from "../../utility";
import { ActionButton } from "./ActionButton";

interface ActionMenuProps {
  children: ReactNode;
}

export const ActionMenu = ({ children }: ActionMenuProps) => {
  return (
    // 'group' class is essential to enable group-hover utilities on children
    <div className="group relative inline-flex">
      {/* Main button - always visible */}
      <ActionButton aria-label="More options">
        <EllipsisVerticalIcon
          className="h-5 w-5 text-gray-500"
          aria-hidden="true"
        />
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
