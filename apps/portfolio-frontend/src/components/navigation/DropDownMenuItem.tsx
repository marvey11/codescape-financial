import { cn } from "@codescape-financial/core-ui";
import { NavLink, useLocation } from "react-router";
import { MenuItem } from "../../types";

interface Props {
  item: MenuItem;
}

export const DropdownMenuItem = ({ item }: Props) => {
  const location = useLocation();
  const isActive = item.to === location.pathname;

  const linkClasses = cn(
    "hover:bg-slate-500 flex items-center h-full px-3 py-2", // Added py-2 for better vertical padding
    {
      "bg-slate-700": isActive,
    },
  );

  return (
    // Use 'group' to enable group-hover utilities on children
    <li className="group relative flex h-full items-center">
      <NavLink to={item.to} className={linkClasses}>
        {item.label}
      </NavLink>

      {item.items && (
        // Sub-menu container: hidden by default, visible on group-hover
        // positioned absolutely relative to the parent <li>
        <ul className="absolute left-0 top-full z-20 m-0 hidden min-w-[160px] list-none rounded-md border border-gray-700 bg-black p-0 shadow-lg group-hover:block">
          {item.items.map((subItem) => (
            <li
              key={subItem.to}
              className="group relative flex h-auto items-stretch"
            >
              <NavLink
                to={subItem.to}
                className={cn(
                  "block w-full px-4 py-2 text-sm text-white hover:bg-slate-600",
                  { "bg-slate-700": location.pathname === subItem.to },
                )}
              >
                {subItem.label}
              </NavLink>

              {/* Recursive rendering for multi-level dropdowns */}
              {subItem.items && (
                <ul className="absolute left-full top-0 z-30 m-0 hidden min-w-[160px] list-none rounded-md border border-gray-700 bg-black p-0 shadow-lg group-hover:block">
                  {subItem.items.map((nestedItem) => (
                    <li key={nestedItem.to}>
                      <NavLink
                        to={nestedItem.to}
                        className={cn(
                          "block w-full px-4 py-2 text-sm text-white hover:bg-slate-600",
                          {
                            "bg-slate-700": location.pathname === nestedItem.to,
                          },
                        )}
                      >
                        {nestedItem.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
