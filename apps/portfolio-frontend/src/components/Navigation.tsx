import { NavigationLink } from "./NavigationLink";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 flex h-[var(--navbar-height)] items-stretch justify-between bg-black px-4 text-white">
      <span className="py-2 text-3xl font-black">{"{csfin}"}</span>

      <ul className="m-0 flex list-none p-0">
        <li>
          <NavigationLink to="/stocks">Stock Universe</NavigationLink>
        </li>
        <li>
          <NavigationLink to="/countries">Countries</NavigationLink>
        </li>
      </ul>
    </nav>
  );
};
