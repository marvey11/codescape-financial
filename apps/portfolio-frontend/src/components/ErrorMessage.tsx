import { ReactNode } from "react";

interface ErrorMessageProps {
  children: ReactNode;
}

export const ErrorMessage = ({ children }: ErrorMessageProps) => (
  <div className="flex flex-col gap-4 w-1/2 bg-red-200 border-2 border-red-400 px-4 py-2 rounded-md shadow-md">
    <span className="font-bold text-red-400">ERROR</span>
    <span className="text-black">{children}</span>
  </div>
);
