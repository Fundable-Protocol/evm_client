"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  FileDown,
  Eye,
  ExternalLink,
  Send,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
import SocialShareModal from "../distribution/SocialShareModal";
import { resendDistributionPayload } from "@/store/distributionEntity";

const ActionsCell = ({ distribution }: ActionsCellProps) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const router = useRouter();

  const handleViewDetails = () => {
    setIsDetailsModalOpen((prev) => !prev);
  };

  const handleResendDistribution = () => {
    resendDistributionPayload.set(distribution);
    router.push("/distribution");
  };

  const handleShareDistribution = () => {
    setIsShareModalOpen(true);
  };

  const actions: IAction[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: () => {},
    },
    ...(distribution.status.toUpperCase() === "COMPLETED" ? [{
      label: "Share Distribution",
      icon: Share2,
      onClick: handleShareDistribution,
    }] : []),
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
    {
      label: "Resend Distribution",
      icon: Send,
      onClick: handleResendDistribution,
    },
  ];

  const handleActionClick = (action: IAction) => {
    if (action.label === "View Details") {
      handleViewDetails();
    } else if (action.label === "Share Distribution") {
      handleShareDistribution();
    } else if (action.label === "Resend Distribution") {
      handleResendDistribution();
    } else {
      action.onClick(distribution);
    }
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

      <SocialShareModal
        distribution={distribution}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default ActionsCell;
