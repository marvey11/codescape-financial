import { ReactNode } from "react";
import { CompositeCellNode } from "../components/data-table";

/**
 * Type guard to check if a value is a CompositeCellNode.
 * @param node The value to check.
 * @returns True if the value is a CompositeCellNode, false otherwise.
 */
export function isCompositeCellNode(
  node: ReactNode | CompositeCellNode,
): node is CompositeCellNode {
  // Check if it's an object and has the 'display' property
  return typeof node === "object" && node !== null && "display" in node;
}
