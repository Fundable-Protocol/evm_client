import { Button } from "@/components/ui/button";
import { DistributionConfirmationModalProps } from "@/types/distribution";

function DistributionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  distributionState,
}: DistributionConfirmationModalProps) {
  if (!isOpen) return null;

  const {
    protocolFeePercentage,
    recipientCount,
    displayableAmount,
    selectedToken,
  } = distributionState;

  return (
    <div className="fixed inset-0 bg-fundable-dark/50 backdrop-blur-xs flex justify-center items-center z-10">
      <div className="bg-fundable-dark border border-fundable-purple rounded-lg p-6 min-w-[60%] md:min-w-[40%] xl:min-w-[30%] mx-auto">
        <h3 className="text-xl font-semibold text-fundable-white mb-4">
          Confirm Distribution
        </h3>

        <div className="space-y-4 mb-6">
          <div className="bg-fundable-mid-dark p-4 rounded-lg">
            <p className="text-fundable-white text-sm">
              Total Amount + {protocolFeePercentage / 100}% Fee
            </p>
            <p className="text-white font-semibold">
              {displayableAmount} {selectedToken}
            </p>
          </div>

          <div className="bg-fundable-mid-dark p-4 rounded-lg">
            <p className="text-fundable-white text-sm">Recipients</p>
            <p className="text-white font-semibold">
              {recipientCount} addresses
            </p>
          </div>
        </div>

        <div className="w-full flex justify-between">
          <Button onClick={onClose} variant="grey" size="md">
            Cancel
          </Button>

          <Button onClick={onConfirm} variant="gradient" size="md">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DistributionConfirmationModal;
