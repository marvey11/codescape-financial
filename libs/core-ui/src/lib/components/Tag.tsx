import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../utility/index.js";

const tagVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
  {
    variants: {
      variant: {
        primary: "bg-blue-100 text-blue-800",
        secondary: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(tagVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Tag.displayName = "Tag";

export { Tag, tagVariants };
