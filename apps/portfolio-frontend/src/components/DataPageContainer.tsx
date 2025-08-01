import { ReactNode } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { Spinner } from "./Spinner";

interface DataPageContainerProps {
  isLoading: boolean;
  error: string;
  children: ReactNode;
}

export const DataPageContainer = ({
  isLoading,
  error,
  children,
}: DataPageContainerProps) => {
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--navbar-height))] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-4">
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );
  }

  return <div className="p-3">{children}</div>;
};
