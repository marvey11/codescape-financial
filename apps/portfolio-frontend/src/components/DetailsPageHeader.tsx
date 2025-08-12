import { ReactNode } from "react";

interface DetailsPageHeaderProps {
  title: string;
  extraComponents?: ReactNode[];
  children?: ReactNode | undefined;
}

export const DetailsPageHeader = ({
  title,
  extraComponents = [],
  children,
}: DetailsPageHeaderProps) => (
  <div className="flex flex-col">
    <div className="mb-3 flex flex-row items-center justify-between gap-1">
      <h1
        className="me-auto w-full overflow-x-clip text-ellipsis whitespace-nowrap text-4xl font-extrabold"
        title={title}
      >
        {title}
      </h1>

      {extraComponents}
    </div>

    {children && (
      <div className="mb-3 flex flex-row flex-wrap items-center justify-start gap-1">
        {children}
      </div>
    )}
  </div>
);
