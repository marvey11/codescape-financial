import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../utility";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-600  disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-600/90",
        destructive: "bg-red-600 text-white hover:bg-red-600/90",
        outline:
          "border border-slate-300 bg-white hover:bg-slate-100 hover:text-slate-900",
        secondary: "bg-slate-500 text-white hover:bg-slate-500/90",
      },
      size: {
        default: "h-10 min-w-24 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
