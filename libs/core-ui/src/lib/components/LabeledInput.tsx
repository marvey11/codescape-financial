import React from "react";
import { Input, InputProps } from "./Input"; // Adjust path to your base Input component

// Extend InputProps to include props that Controller might pass,
// as well as your custom 'label' prop.
interface LabeledInputProps extends InputProps {
  label: string; // The label for the input (required for this component)
  // Add other Controller-specific props if your Controller uses them
  // For 'as' prop, RHF passes value, onChange, onBlur, ref implicitly.
  // valueAsNumber is an RHF internal option, not a prop for the rendered component.
}

export const LabeledInput = React.forwardRef<
  HTMLInputElement,
  LabeledInputProps
>(({ label, id, className, type, ...props }, ref) => {
  return (
    // Use a fragment if LabeledInput is a direct child of a grid container
    <>
      {label &&
        id && ( // Ensure label and id exist for accessibility
          <label htmlFor={id} className="font-medium text-gray-700">
            {label}
          </label>
        )}
      <Input
        id={id} // Pass id to the underlying Input
        type={type} // Pass type to the underlying Input
        className={className} // Pass className for custom styling on the input itself
        ref={ref} // Forward the ref from Controller to the native Input
        {...props} // Spread all other props (including RHF's injected ones)
      />
    </>
  );
});
LabeledInput.displayName = "LabeledInput";
