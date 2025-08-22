import { formatPercent } from "@codescape-financial/core";

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  index?: number;
  name?: string;
  value?: number;
}

const RADIAN = Math.PI / 180;

// Custom label rendering function
export const PieChartCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}: CustomLabelProps) => {
  // Add checks for undefined props if they are critical for your calculation,
  // especially if 'percent' or 'name' might be missing for very small slices.
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    outerRadius === undefined ||
    percent === undefined ||
    name === undefined
  ) {
    return null; // Don't render label if crucial data is missing
  }

  // Calculate the position for the label outside the slice
  const radiusOffset = outerRadius * 1.2;
  const x = cx + radiusOffset * Math.cos(-midAngle * RADIAN);
  const y = cy + radiusOffset * Math.sin(-midAngle * RADIAN);

  // Determine text anchor based on angle to align text correctly
  const textAnchor = x > cx ? "start" : "end";

  return (
    <text
      x={x}
      y={y}
      fill="#330000" // Choose a visible color for the text
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={10} // Adjust font size as needed
    >
      {`${name} (${formatPercent(percent)})`}
    </text>
  );
};
