import { useMemo, useState } from "react";
import { useAccount, useNetwork } from "@starknet-react/core";
import type { AccountInterface } from "starknet";
import toast from "react-hot-toast";

import PaymentStreamForm from "./PaymentStreamForm";
import PaymentStreamSummary from "./PaymentStreamSummary";
import { capitalizeWord, getTokenOptions } from "@/lib/utills";
import { PaymentStreamService } from "@/services/paymentStreamService";
import type { DurationUnit } from "@/lib/utills/stream";
import { parseUnits } from "ethers";

const CreatePaymentStream = () => {
  const { chain } = useNetwork();
  const { account, address } = useAccount();
  const { tokenOptions } = getTokenOptions(chain);

  const durationOptions = ["hour", "day", "week", "month", "year"].map((option) => ({
    label: capitalizeWord(option),
    value: option,
  }));

  const [streamData, setStreamData] = useState({
    name: "",
    recipient: "",
    token: tokenOptions[0].value,
    amount: "",
    duration: durationOptions[0].value,
    durationValue: "",
    cancellability: false,
    transferability: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const selectedTokenDecimals = useMemo(() => {
    const option = tokenOptions.find((o) => o.value === streamData.token);
    const { SUPPORTED_TOKENS } = getTokenOptions(chain);
    const token = SUPPORTED_TOKENS[(option?.value || "STRK") as keyof typeof SUPPORTED_TOKENS];
    return token.decimals;
  }, [tokenOptions, streamData.token, chain]);

  const handleSubmit = async () => {
    if (!address) {
      toast.error("Connect your wallet");
      return;
    }
    try {
      setIsSubmitting(true);
      const totalAmountScaled = parseUnits(streamData.amount || "0", selectedTokenDecimals).toString();

      const { transactionHash } = await PaymentStreamService.createStream(
        account as AccountInterface,
        chain,
        {
          name: streamData.name,
          recipient: streamData.recipient,
          tokenSymbol: streamData.token,
          totalAmount: totalAmountScaled,
          durationValue: Number(streamData.durationValue),
          durationUnit: streamData.duration as DurationUnit,
          cancellable: Boolean(streamData.cancellability),
          transferable: Boolean(streamData.transferability),
        }
      );

      toast.success(`Stream submitted: ${transactionHash.slice(0, 10)}...`);
      // Reset form to initial state
      setStreamData({
        name: "",
        recipient: "",
        token: tokenOptions[0].value,
        amount: "",
        duration: durationOptions[0].value,
        durationValue: "",
        cancellability: false,
        transferability: false,
      });
      setFormKey((k) => k + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create stream";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is on mainnet
  if (chain?.network === "mainnet") {
    return (
      <main className="flex items-center justify-center h-dvh w-full">
        <div className="max-w-2xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Feature Not Available on Mainnet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Payment streams are currently only available on testnet.
          </p>
          <div className="p-2">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              To continue, please switch your network to testnet in your wallet.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex gap-x-6 h-dvh w-full justify-between">
      <PaymentStreamForm
        key={formKey}
        streamData={streamData}
        tokenOptions={tokenOptions}
        setStreamData={setStreamData}
        durationOptions={durationOptions}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <PaymentStreamSummary streamData={streamData} />
    </main>
  );
};

export default CreatePaymentStream;
