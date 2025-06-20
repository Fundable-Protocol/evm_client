"use client";

import { useState } from "react";
import { MoreHorizontal, FileDown, Eye, ExternalLink } from "lucide-react";

import {
  getExplorerUrl,
  generateDistributionPDF,
  generateDistributionCSV,
} from "@/lib/utills/history";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ActionsCellProps, IAction } from "@/types/history";
import DistributionDetailsModal from "./DistributionDetailsModal";

const actions: IAction[] = [
  {
    label: "View Details",
    icon: Eye,
    onClick: () => {},
  },
  {
    label: "Export as PDF",
    icon: FileDown,
    onClick: (distribution: ActionsCellProps["distribution"]) =>
      generateDistributionPDF(distribution),
  },
  {
    label: "Export as CSV",
    icon: FileDown,
    onClick: (distribution: ActionsCellProps["distribution"]) =>
      generateDistributionCSV(distribution),
  },
  {
    label: "View on Explorer",
    icon: ExternalLink,
    onClick: (distribution: ActionsCellProps["distribution"]) => {
      const url = getExplorerUrl(distribution);
      if (url) window.open(url, "_blank");
    },
  },
];

const ActionsCell = ({ distribution }: ActionsCellProps) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = () => {
    setIsDetailsModalOpen((prev) => !prev);
  };

  const handleActionClick = (action: IAction) => {
    if (action.label === "View Details") handleViewDetails();
    else action.onClick(distribution);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-fundable-violet/20"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-fundable-mid-dark border-gray-700"
        >
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.label}
              className="text-white hover:bg-fundable-violet cursor-pointer focus:bg-fundable-violet focus:text-white"
              onClick={() => handleActionClick(action)}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DistributionDetailsModal
        distribution={distribution}
        isOpen={isDetailsModalOpen}
        onClose={handleViewDetails}
      />
    </>
  );
};

export default ActionsCell;
