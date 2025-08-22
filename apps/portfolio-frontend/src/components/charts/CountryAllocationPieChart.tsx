import { CountryAllocationDTO } from "@codescape-financial/portfolio-data-models";
import { PieChart } from "lucide-react";
import { Cell, Pie } from "recharts";
import { PIE_CHART_COLORS } from "./pie-chart-colors";
import { PieChartCustomLabel } from "./PieChartCustomLabel";

interface Props {
  portfolioId: string;
  date: Date;
  countryAllocation: CountryAllocationDTO[];
}

export const CountryAllocationPieChart = ({ countryAllocation }: Props) => (
  <PieChart>
    <Pie
      data={countryAllocation}
      dataKey="value" // Ensure dataKey maps to numerical value (e.g., 'value')
      nameKey="name"
      outerRadius={200} // Adjust radius as needed
      labelLine={true} // Hide lines for cleaner look with custom labels
      label={PieChartCustomLabel} // Pass the custom render function here
      isAnimationActive={true} // Disable animation during development if it's distracting
    >
      {/* Assign colors to slices using Cell components */}
      {countryAllocation.map((entry, index) => (
        <Cell
          key={`cell-${entry.countryCode}`}
          fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
        />
      ))}
    </Pie>
    {/* You might also want a Tooltip and Legend */}
    {/* <Tooltip /> */}
    {/* <Legend /> */}
  </PieChart>
);
