"use client";

import { DistributionAttributes } from "@/types/distribution";

import { getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DistributionDetailsModalProps {
  distribution: DistributionAttributes | null;
  isOpen: boolean;
  onClose: () => void;
}

const DistributionDetailsModal = ({
  distribution,
  isOpen,
  onClose,
}: DistributionDetailsModalProps) => {
  if (!distribution || !isOpen) return null;

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
      label: "Type",
      value: distribution.distribution_type,
    },
    {
      label: "Network",
      value: distribution.network,
    },
    {
      label: "Amount",
      value: distribution.total_amount,
    },
    {
      label: "Recipients",
      value: distribution.total_recipients,
    },
    {
      label: "Date",
      value: new Date(distribution.created_at).toLocaleString(),
    },
    {
      label: "Transaction Hash",
      value: distribution.transaction_hash || "N/A",
    },
  ];

  return (
    // <Dialog open={open} onOpenChange={handleClose}>
    //   <DialogContent className="bg-fundable-mid-dark border-gray-700 text-white">
    //     <DialogHeader>
    //       <DialogTitle className="text-xl font-semibold text-white">
    //         Distribution Details
    //       </DialogTitle>
    //     </DialogHeader>
    //     <div className="grid gap-4 py-4">
    //       {details.map((detail, index) => (
    //         <div
    //           key={index}
    //           className="grid grid-cols-[1fr_2fr] items-center gap-4 border-b border-gray-700 py-2"
    //         >
    //           <h3 className="text-sm font-medium text-gray-400 whitespace-nowrap">
    //             {detail.label}
    //           </h3>
    //           <span className="text-sm">{detail.value}</span>
    //         </div>
    //       ))}
    //     </div>
    //   </DialogContent>
    // </Dialog>

    <div className="fixed inset-0 bg-fundable-dark/50 backdrop-blur-xs flex justify-center items-center z-10">
      <div className="bg-fundable-dark border border-fundable-purple rounded-lg p-6 min-w-[60%] md:min-w-[40%] xl:min-w-[30%] mx-auto">
        <h3 className="text-xl font-semibold text-fundable-white mb-4">
          Distribution Details
        </h3>

        <div className="space-y-4 mb-6">
          {details.map((detail, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_2fr] items-center gap-4 border-b border-gray-700 py-2"
            >
              <h3 className="text-sm font-medium text-gray-400 whitespace-nowrap">
                {detail.label}
              </h3>
              <span className="text-sm">{detail.value}</span>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onClose}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DistributionDetailsModal;
