import { ReactElement, ReactNode } from "react";

interface Props {
  label: ReactElement;
  children: ReactNode;
}

export const FormRow = ({ label, children }: Props) => {
  return (
    <>
      {label}
      {children}
    </>
  );
};
