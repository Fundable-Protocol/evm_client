import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-fundable-dark/50 backdrop-blur-xs flex justify-center items-center z-50 px-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-fundable-dark border border-fundable-purple rounded-lg p-6 min-w-[60%] md:min-w-[40%] xl:min-w-[30%] mx-auto">
        <h3 className="text-xl font-semibold text-fundable-white mb-4">
          {title}
        </h3>

        <div className="mb-6">{children}</div>

        <div className="w-full flex justify-between">
          <Button
            onClick={onClose}
            variant="grey"
            size="md"
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            onClick={onConfirm}
            variant="gradient"
            size="md"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
