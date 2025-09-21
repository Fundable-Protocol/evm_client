import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { StreamData } from "@/types/payment-stream";
import { capitalizeWord } from "@/lib/utils";

export interface PaymentStreamConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  streamData: StreamData;
  isLoading?: boolean;
}

function PaymentStreamConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  streamData,
  isLoading = false,
}: PaymentStreamConfirmationModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirm Payment Stream"
      confirmText="Create Stream"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="bg-fundable-mid-dark p-4 rounded-lg">
          <p className="text-fundable-white text-sm">Stream Details</p>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-fundable-light-grey">Name:</span>
              <span className="text-white font-semibold">
                {streamData.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-fundable-light-grey">Amount:</span>
              <span className="text-white font-semibold">
                {streamData.amount || "0"} {streamData.token}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-fundable-light-grey">Duration:</span>
              <span className="text-white font-semibold">
                {streamData.durationValue} {capitalizeWord(streamData.duration)}
                {+streamData.durationValue > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-fundable-mid-dark p-4 rounded-lg">
          <p className="text-fundable-white text-sm">Recipient</p>
          <p className="text-white font-bold mt-1 text-xs break-all overflow-wrap-anywhere">
            {streamData.recipient ? streamData.recipient : "N/A"}
          </p>
        </div>

        <div className="bg-fundable-mid-dark p-4 rounded-lg">
          <p className="text-fundable-white text-sm">Stream Settings</p>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-fundable-light-grey">Cancellable:</span>
              <span className="text-white font-semibold">
                {streamData.cancellability ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-fundable-light-grey">Transferable:</span>
              <span className="text-white font-semibold">
                {streamData.transferability ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ConfirmationModal>
  );
}

export default PaymentStreamConfirmationModal;
