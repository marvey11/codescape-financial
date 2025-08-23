import { formatCurrency, formatPercent } from "@codescape-financial/core";
import { AssetAllocationDTO } from "@codescape-financial/portfolio-data-models";
import { useMemo } from "react";
import { Tooltip, TooltipProps, Treemap } from "recharts";

const getPerformanceColor = (
  xirr: number | null | undefined,
  maxAbsXirr: number,
): string => {
  if (xirr === null || xirr === undefined || isNaN(xirr)) {
    return "#9E9E9E"; // Grey for no data
  }

  if (maxAbsXirr === 0) {
    return xirr > 0 ? "hsl(120, 70%, 50%)" : "hsl(0, 70%, 50%)";
  }

  const ratio = Math.min(Math.abs(xirr) / maxAbsXirr, 1); // ensure ratio is not > 1
  const lightness = 80 - ratio * 50; // from 80% (light) to 30% (dark)

  if (xirr > 0) {
    return `hsl(120, 70%, ${lightness}%)`; // Green
  } else {
    return `hsl(0, 70%, ${lightness}%)`; // Red
  }
};

/**
 * The root of the treemap data structure.
 */
interface TreemapData {
  name: string;
  children: TreemapDataItem[];
}

export type AllocationTreemapItem = AssetAllocationDTO & {
  xirr?: number | undefined;
};

/**
 * The child items of the treemap data structure.
 */
type TreemapDataItem = AllocationTreemapItem & {
  [key: string]: unknown;
};

interface StockAllocationTreemapProps {
  portfolioId: string;
  date: Date;
  assetAllocation: AllocationTreemapItem[];
  width?: number;
  height?: number;
}

export const StockAllocationTreemap = ({
  assetAllocation,
  width = 300,
  height = 300,
}: StockAllocationTreemapProps) => {
  const maxAbsXirr = useMemo(() => {
    if (!assetAllocation || assetAllocation.length === 0) {
      return 0;
    }
    const xirrValues = assetAllocation.map((item) => Math.abs(item.xirr ?? 0));
    return Math.max(...xirrValues);
  }, [assetAllocation]);

  if (!assetAllocation || assetAllocation.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-white text-center text-gray-500 shadow-md">
        No asset allocation data to display.
      </div>
    );
  }

  // Recharts Treemap can take a flat array of nodes as `data`,
  // but if you want to use the `root` prop in custom content,
  // it's sometimes easier to wrap it in a single root.
  const treemapData: TreemapData = {
    name: "Root",
    children: assetAllocation.map((asset) => ({
      ...asset, // Spread all properties from AssetAllocationDTO
    })),
  };

  return (
    <Treemap
      width={width}
      height={height}
      data={treemapData.children} // Pass the array of children as data
      dataKey="value" // This prop indicates which field determines the size of the rectangle
      nameKey="name" // This prop indicates which field is the name of the node
      aspectRatio={16 / 9} // Maintain aspect ratio
      stroke="#fff" // Default stroke for all segments
      fill="#fff" // Default fill for all segments (will be overridden by custom content)
      content={<CustomTreemapContent maxAbsXirr={maxAbsXirr} />}
    >
      <Tooltip content={<CustomTreemapTooltip />} />
    </Treemap>
  );
};

// Custom tooltip content (optional but recommended for treemaps)
interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: { payload: AllocationTreemapItem }[];
}

const CustomTreemapTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length && payload[0] && payload[0].payload) {
    const data = payload[0].payload;
    return (
      <div className="rounded border border-gray-300 bg-white p-2 text-sm text-gray-800 shadow-md">
        <p className="font-semibold">{data.name}</p>
        <p>Value: {formatCurrency(data.value)}</p>
        <p>Allocation: {formatPercent(data.percentage)}</p>
        {data.xirr !== undefined && <p>XIRR: {formatPercent(data.xirr)}</p>}
      </div>
    );
  }
  return null;
};

// You'll likely need a custom `Treemap` content component to apply individual colors.
// This is a common pattern for Recharts Treemap.
interface CustomTreemapContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  depth?: number;
  index?: number; // Index of the current item in the data array
  root?: { children: TreemapDataItem[] }; // The root data object passed to Treemap
  // Custom props for the actual data item, passed via Treemap's internal logic
  isin?: string;
  xirr?: number;
  maxAbsXirr?: number;
}

const CustomTreemapContent = ({
  x,
  y,
  width,
  height,
  name,
  value,
  index,
  root,
  maxAbsXirr,
}: CustomTreemapContentProps) => {
  // Ensure we have valid dimensions and data for rendering
  if (
    width === undefined ||
    width < 10 || // Min width to draw
    height === undefined ||
    height < 10 || // Min height to draw
    x === undefined ||
    y === undefined ||
    name === undefined ||
    value === undefined ||
    index === undefined
  ) {
    return null;
  }

  // Determine color (for now, simple cycle; later use getPerformanceColor)
  // When using data directly from root.children, `index` and `root.children` are useful
  const dataItem = root?.children ? root.children[index] : undefined; // Get the actual data item
  const color = getPerformanceColor(dataItem?.xirr, maxAbsXirr ?? 0);

  const isRotated = width < 100 && height > width;
  const fontSize = isRotated
    ? Math.min(14, Math.max(8, height / (name.length + 3)))
    : Math.min(14, Math.max(8, width / (name.length + 3)));

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: "#fff", // White border between segments
          strokeWidth: 3,
          // opacity: 0.75, // Slightly reduced opacity
        }}
      />

      {/* Render label directly on the rectangle */}
      {width > 20 &&
        height > 20 && ( // Only show label for reasonably sized rectangles
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff" // White text for visibility
            fontSize={fontSize} // Dynamic font size
            transform={
              isRotated
                ? `rotate(-90, ${x + width / 2}, ${y + height / 2})`
                : undefined
            }
            className="pointer-events-none" // Prevent text from blocking hover events for tooltip
          >
            {name}
          </text>
        )}
    </g>
  );
};
