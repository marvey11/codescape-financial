import {
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EuroIcon,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react";
import { IconName } from "./icon-names";

export const iconMapping: Record<
  IconName,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  AddOperation: PlusIcon,
  BuyOperation: ArrowUpIcon,
  DividendOperation: EuroIcon,
  MoreOptions: MoreVerticalIcon,
  SellOperation: ArrowDownIcon,
  StockSplitOperation: ArrowsRightLeftIcon,
  ViewDetails: MagnifyingGlassIcon,
};
