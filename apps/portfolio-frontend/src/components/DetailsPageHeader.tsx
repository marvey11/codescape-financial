import { Button } from "@codescape-financial/core-ui";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface DetailsPageHeaderProps {
  title: string;
  editPath: string;
  onDelete: () => void;
  children: ReactNode;
}

export const DetailsPageHeader = ({
  title,
  editPath,
  onDelete,
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

      <Link to={editPath}>
        <Button>Edit</Button>
      </Link>

      <Button onClick={onDelete} variant="destructive">
        Delete
      </Button>
    </div>

    <div className="mb-3 flex flex-row flex-wrap items-center justify-start gap-1">
      {children}
    </div>
  </div>
);
