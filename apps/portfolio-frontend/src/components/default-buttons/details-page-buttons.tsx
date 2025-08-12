import { Button } from "@codescape-financial/core-ui";
import { Link } from "react-router-dom";

interface DetailsPageEditButtonProps {
  editPath: string;
}

export const DetailsPageEditButton = ({
  editPath,
}: DetailsPageEditButtonProps) => (
  <Link to={editPath}>
    <Button>Edit</Button>
  </Link>
);

interface DetailsPageDeleteButtonProps {
  onDelete: () => void;
}

export const DetailsPageDeleteButton = ({
  onDelete,
}: DetailsPageDeleteButtonProps) => (
  <Button onClick={onDelete} variant="destructive">
    Delete
  </Button>
);
