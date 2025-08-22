import { cn } from "@codescape-financial/core-ui";
import { iconMapping } from "./icon-mapping";
import { IconName } from "./icon-names";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  // Extends SVG props for things like className, strokeWidth, etc.
  name: IconName;
  className?: string; // Tailwind classes
}
export const Icon = ({ name, className, ...props }: IconProps) => {
  const baseClassName = "h-5 w-5 text-gray-500";

  const IconComponent = (() => iconMapping[name])();

  if (!IconComponent) {
    return null; // Or render a fallback icon/placeholder
  }

  // Pass through className and any other SVG props
  return <IconComponent className={cn(baseClassName, className)} {...props} />;
};
