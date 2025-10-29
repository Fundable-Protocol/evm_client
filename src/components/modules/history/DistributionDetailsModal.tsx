"use client";

import { getStatusColor } from "@/lib/utils";
import { X } from "lucide-react";
import { DistributionDetailsModalProps } from "@/types/history";

const DistributionDetailsModal = ({
  distribution,
  isOpen,
  onClose,
}: DistributionDetailsModalProps) => {
  if (!distribution || !isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
    else return;
  };

  const details = [
    {
      label: "Distribution ID",
      value: distribution.id,
    },
    {
      label: "Status",
      value: (
        <div className="flex items-center">
          <span
            className={`size-2 rounded-full ${getStatusColor(
              distribution.status.toUpperCase()
            )} mr-2`}
          />
          <span className="text-white capitalize">{distribution.status}</span>
        </div>
      ),
    },
    {
      label: "DistributionType",
      value: distribution.distribution_type,
    },
    {
      label: "Network",
      value: distribution.chain_name || "Unknown",
    },
    {
      label: "Chain",
      value: distribution.chain_name || "Unknown",
    },
    {
      label: "Total Amount",
      value: `${distribution.total_amount} ${distribution.token_symbol}`,
    },
    {
      label: "Fee Amount",
      value: `${distribution.fee_amount} ${distribution.token_symbol}`,
    },
    {
      label: "Total Recipients",
      value: distribution.total_recipients,
    },
    {
      label: "Date",
      value: new Date(distribution.created_at).toLocaleString(),
    },
    {
      label: "Tx Hash",
      value: distribution.transaction_hash || "N/A",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-fundable-dark/50 backdrop-blur-xs flex justify-center items-center z-10 cursor-auto px-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-fundable-dark border border-fundable-purple rounded-lg p-6 min-w-[60%] md:min-w-[40%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-fundable-white">
            Distribution Details
          </h3>

          <X className="text-fundable-white cursor-pointer" onClick={onClose} />
        </div>

        <div className="space-y-4 mb-6 w-full">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-gray-700 py-2 w-full justify-between"
            >
              <h3 className="text-sm font-medium text-gray-400 whitespace-nowrap">
                {detail.label}
              </h3>
              <span className="text-sm truncate">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistributionDetailsModal;
