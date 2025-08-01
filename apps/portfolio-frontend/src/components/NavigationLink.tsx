import { cn } from "@codescape-financial/core-ui";
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface NavigationLinkProps {
  to: string;
  children: ReactNode;
}

export const NavigationLink = ({ to, children }: NavigationLinkProps) => {
  const location = useLocation();

  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={cn("hover:bg-slate-500 flex items-center h-full px-3", {
        "bg-slate-700": isActive,
      })}
    >
      {children}
    </NavLink>
  );
};
