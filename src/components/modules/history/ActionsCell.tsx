"use client";

import { useState } from "react";
import { MoreHorizontal, FileDown, Eye, ExternalLink } from "lucide-react";
import { DistributionAttributes } from "@/types/distribution";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DistributionDetailsModal from "./DistributionDetailsModal";

interface ActionsCellProps {
  distribution: DistributionAttributes;
}

const ActionsCell = ({ distribution }: ActionsCellProps) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
          <DropdownMenuItem
            className="text-white hover:bg-fundable-violet cursor-pointer focus:bg-fundable-violet focus:text-white"
            onClick={() => setIsDetailsModalOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-white hover:bg-fundable-violet cursor-pointer focus:bg-fundable-violet focus:text-white"
            onClick={() => {
              // TODO: Implement export as PDF
              console.log("Export PDF:", distribution.id);
            }}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-white hover:bg-fundable-violet cursor-pointer focus:bg-fundable-violet focus:text-white"
            onClick={() => {
              // TODO: Implement export as CSV
              console.log("Export CSV:", distribution.id);
            }}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-white hover:bg-fundable-violet cursor-pointer focus:bg-fundable-violet focus:text-white"
            onClick={() => {
              // TODO: Implement view on explorer
              console.log("View on explorer:", distribution.id);
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DistributionDetailsModal
        distribution={distribution}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
};

export default ActionsCell;
