"use client";

import React, { useState } from "react";
import { ExternalLink, MoreHorizontal, Copy, Wallet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { StreamRecord } from "@/types/payment-stream";
import { getStreamExplorerUrl } from "@/lib/utils/stream";
import WithdrawStreamModal from "./WithdrawStreamModal";

type StreamActionsCellProps = {
  stream: StreamRecord;
};

export default function StreamActionsCell({ stream }: StreamActionsCellProps) {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const handleViewOnExplorer = () => {
    const url = getStreamExplorerUrl(stream);
    if (url) window.open(url, "_blank");
  };

  const handleCopyTxHash = async () => {
    if (!stream?.transaction_hash) return;
    try {
      await navigator.clipboard.writeText(stream.transaction_hash);
    } catch {}
  };

  const handleOpenWithdraw = () => setIsWithdrawOpen(true);
  const handleCloseWithdraw = () => setIsWithdrawOpen(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-fundable-violet/20">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-fundable-mid-dark border-gray-700">
          <DropdownMenuItem
            className="text-white hover:bg-fundable-violet cursor-pointer focus:bg-fundable-violet focus:text-white"
            onClick={handleOpenWithdraw}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Withdraw
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-white hover:bg-fundable-violet cursor-pointer focus:bg-fundable-violet focus:text-white"
            onClick={handleViewOnExplorer}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-white hover:bg-fundable-violet cursor-pointer focus:bg-fundable-violet focus:text-white"
            onClick={handleCopyTxHash}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Tx Hash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WithdrawStreamModal isOpen={isWithdrawOpen} onClose={handleCloseWithdraw} stream={stream} />
    </>
  );
}


