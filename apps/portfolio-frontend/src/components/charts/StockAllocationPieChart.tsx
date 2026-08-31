import { AssetAllocationDTO } from "@codescape-financial/portfolio-data-models";
import { Cell, Pie, PieChart } from "recharts";
import { PIE_CHART_COLORS } from "./pie-chart-colors";
import { PieChartCustomLabel } from "./PieChartCustomLabel";

interface Props {
  portfolioId: string;
  date: Date;
  assetAllocation: AssetAllocationDTO[];
  width?: number;
  height?: number;
}

export const StockAllocationPieChart = ({
  assetAllocation,
  width = 300,
  height = 300,
}: Props) => {
  return (
    <PieChart width={width} height={height}>
      <Pie
        data={assetAllocation}
        dataKey="value" // Ensure dataKey maps to numerical value (e.g., 'value')
        nameKey="name"
        outerRadius={200} // Adjust radius as needed
        labelLine={true} // Hide lines for cleaner look with custom labels
        label={PieChartCustomLabel} // Pass the custom render function here
        isAnimationActive={true} // Disable animation during development if it's distracting
      >
        {/* Assign colors to slices using Cell components */}
        {assetAllocation.map((entry, index) => (
          <Cell
            key={`cell-${entry.isin}`}
            fill={
              PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] ?? "#8884d8"
            }
          />
        ))}
      </Pie>
      {/* You might also want a Tooltip and Legend */}
      {/* <Tooltip /> */}
      {/* <Legend /> */}
    </PieChart>
  );
};
