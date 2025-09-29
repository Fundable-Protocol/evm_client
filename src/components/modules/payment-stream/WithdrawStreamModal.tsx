import { useEffect, useMemo, useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import type { StreamRecord } from "@/types/payment-stream";
import { useAccount, useNetwork } from "@starknet-react/core";
import { parseUnits } from "ethers";
import toast from "react-hot-toast";
import { PaymentStreamService } from "@/services/blockchain/paymentStreamService";
import { getTokenOptions } from "@/lib/utils";

interface WithdrawStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: StreamRecord;
}

export default function WithdrawStreamModal({ isOpen, onClose, stream }: WithdrawStreamModalProps) {
  const { chain } = useNetwork();
  const { account, address } = useAccount();
  const { SUPPORTED_TOKENS } = getTokenOptions(chain);
  const tokenInfo = SUPPORTED_TOKENS[stream.token_symbol as keyof typeof SUPPORTED_TOKENS];

  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");
  const [useSelf, setUseSelf] = useState(true);
  const [useMax, setUseMax] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawableAmount, setWithdrawableAmount] = useState<string>("0");

  console.log("stream.stream_id", stream.stream_id);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await PaymentStreamService.getWithdrawableAmount(chain, stream.stream_id);
        if (!cancelled && result.success && result.amount) {
          setWithdrawableAmount(result.amount);
        }
      } catch {
        toast.error("Failed to fetch withdrawable amount");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chain, stream.stream_id]);

  console.log("withdrawableAmount", withdrawableAmount);

  const estimatedMaxSmallest = useMemo(() => {
    try {
      return BigInt(withdrawableAmount || "0");
    } catch {
      return BigInt(0);
    }
  }, [withdrawableAmount]);

  const estimatedMaxDisplay = useMemo(() => {
    const decimals = tokenInfo?.decimals ?? 18;
    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = estimatedMaxSmallest / divisor;
    const frac = estimatedMaxSmallest % divisor;
    const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
    return fracStr ? `${whole.toString()}.${fracStr}` : whole.toString();
  }, [estimatedMaxSmallest, tokenInfo?.decimals]);

  const handleConfirm = async () => {
    if (!address) {
      toast.error("Connect your wallet");
      return;
    }

    try {
      setIsSubmitting(true);
      let result;
      const toAddress = (useSelf ? address! : to).toLowerCase();

      if (useMax) {
        result = await PaymentStreamService.withdrawMaxStream(account!, chain, {
          streamId: stream.stream_id,
          to: toAddress,
        });
      } else {
        const scaledAmount = parseUnits(amount, tokenInfo.decimals).toString();
        result = await PaymentStreamService.withdrawStream(account!, chain, {
          streamId: stream.stream_id,
          amount: scaledAmount,
          to: toAddress,
        });
      }

      if (!result.success || !result.data) {
        toast.error(result.message || "Failed to withdraw");
        return;
      }

      toast.success("Withdrawal submitted");
      onClose();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to withdraw";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Withdraw From Stream"
      confirmText="Withdraw"
      isLoading={isSubmitting}
    >
      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm text-fundable-light-grey">Amount ({stream.token_symbol})</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-3 py-1 rounded border text-sm ${useMax ? "bg-fundable-violet text-white border-fundable-violet" : "bg-fundable-mid-dark text-white border-gray-700"}`}
              onClick={() => setUseMax(true)}
              disabled={isSubmitting}
            >
              Max
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded border text-sm ${!useMax ? "bg-fundable-violet text-white border-fundable-violet" : "bg-fundable-mid-dark text-white border-gray-700"}`}
              onClick={() => setUseMax(false)}
              disabled={isSubmitting}
            >
              Custom
            </button>
            {useMax && (
              <span className="text-xs text-fundable-light-grey ml-2">~ {estimatedMaxDisplay}</span>
            )}
          </div>
          {!useMax && (
            <input
              className="bg-fundable-mid-dark border border-gray-700 rounded p-2 text-white"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
            />
          )}
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-fundable-light-grey">Withdraw To</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-3 py-1 rounded border text-sm ${useSelf ? "bg-fundable-violet text-white border-fundable-violet" : "bg-fundable-mid-dark text-white border-gray-700"}`}
              onClick={() => setUseSelf(true)}
              disabled={isSubmitting}
            >
              Self
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded border text-sm ${!useSelf ? "bg-fundable-violet text-white border-fundable-violet" : "bg-fundable-mid-dark text-white border-gray-700"}`}
              onClick={() => setUseSelf(false)}
              disabled={isSubmitting}
            >
              New address
            </button>
          </div>
          {!useSelf && (
            <input
              className="bg-fundable-mid-dark border border-gray-700 rounded p-2 text-white break-all"
              placeholder="0x..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={isSubmitting}
            />
          )}
          {useSelf && (
            <p className="text-xs text-fundable-light-grey break-all">{address}</p>
          )}
        </div>
      </div>
    </ConfirmationModal>
  );
}


