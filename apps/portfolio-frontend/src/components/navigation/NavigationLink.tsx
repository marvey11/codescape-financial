import { cn } from "@codescape-financial/core-ui";
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router";

interface NavigationLinkProps {
  to: string;
  children: ReactNode;
}

export const NavigationLink = ({ to, children }: NavigationLinkProps) => {
  const location = useLocation();
  // Ensure that if the current path is a sub-route, the parent link still appears active.
  // This is a common UX pattern for navigation.
  const isActive =
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink
      to={to}
      className={cn("flex h-full items-center px-3 hover:bg-slate-500", {
        "bg-slate-700": isActive,
      })}
    >
      {children}
    </NavLink>
  );
};
