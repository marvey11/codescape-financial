import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../utility";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label htmlFor={props.id} className="ml-2 text-sm text-gray-900">
            {label}
          </label>
        )}
      </div>
    );
  },
);
