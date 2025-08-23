import React, { cloneElement, isValidElement, ReactNode } from "react";

interface LabeledFormFieldProps {
  /**
   * The ID will be used for both the label's htmlFor and the child's id.
   */
  id: string;

  /**
   * The label to display.
   */
  label: string;

  /**
   * The underlying form field
   */
  children: ReactNode; // This will be the input, select, or custom input group
}

export const LabeledFormField = React.forwardRef<
  HTMLElement,
  LabeledFormFieldProps
>(({ label, id, children }, ref) => {
  if (!isValidElement(children)) {
    console.error(
      "LabeledFormField expects a single React element as its child.",
    );
    return null;
  }

  // Clone the child element to inject props like ref and id
  // We also spread any props coming from react-hook-form's `field` object
  const clonedChild = cloneElement(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children as React.ReactElement<any>,
    {
      id: id,
      ref: ref, // Inject the ref here
      // Any other props that the child component might need from the parent context
      // For instance, if you want to pass field.name to the child, you'd do:
      // name: (children.props as any)?.name || undefined,
    },
  );

  return (
    // Use a React Fragment so the label and clonedChild are direct children
    // of the surrounding grid (your form).
    <>
      <label htmlFor={id} className="font-medium text-gray-700">
        {label}
      </label>
      {clonedChild}
    </>
  );
});
LabeledFormField.displayName = "LabeledFormField";
