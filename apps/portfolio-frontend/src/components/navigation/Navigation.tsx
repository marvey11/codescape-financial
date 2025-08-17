import { Fragment, useMemo } from "react";
import jsonNavigationMenu from "../../data/navigation-menu.json";
import { MenuItem } from "../../types";
import { DropdownMenuItem } from "./DropDownMenuItem";
import { NavigationLink } from "./NavigationLink";

export const Navigation = () => {
  const navigationMenu = useMemo(
    () => jsonNavigationMenu satisfies MenuItem[],
    [],
  );

  return (
    <nav className="sticky top-0 z-[100] flex h-[var(--navbar-height)] items-stretch justify-between bg-black px-4 text-white shadow-md">
      <span className="py-2 text-3xl font-black">{"{csfin}"}</span>

      <ul className="mx-2 flex list-none px-2">
        {navigationMenu.map((item) => (
          <Fragment key={item.to}>
            {item.items ? (
              <DropdownMenuItem item={item} />
            ) : (
              <li>
                <NavigationLink to={item.to}>{item.label}</NavigationLink>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};
