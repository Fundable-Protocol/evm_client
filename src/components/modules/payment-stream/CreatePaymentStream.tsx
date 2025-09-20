import toast from "react-hot-toast";
import { parseUnits } from "ethers";
import { useMemo, useState } from "react";
import type { AccountInterface } from "starknet";
import { useAccount, useNetwork } from "@starknet-react/core";
import { useQueryClient } from "@tanstack/react-query";

import PaymentStreamForm from "./PaymentStreamForm";
import type { DurationUnit } from "@/lib/utils/stream";
import PaymentStreamSummary from "./PaymentStreamSummary";
import PaymentStreamConfirmationModal from "./PaymentStreamConfirmationModal";
import { capitalizeWord, getTokenOptions } from "@/lib/utils";
import type { CreateStreamResponse } from "@/types/payment-stream";
import { createPaymentStreamSchema } from "@/validations/paymentStream";
import { PaymentStreamService } from "@/services/blockchain/paymentStreamService";

const CreatePaymentStream = () => {
  const { chain } = useNetwork();
  const { account, address } = useAccount();
  const { tokenOptions } = getTokenOptions(chain);
  const queryClient = useQueryClient();

  const durationOptions = ["hour", "day", "week", "month", "year"].map(
    (option) => ({
      label: capitalizeWord(option),
      value: option,
    })
  );

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
  const [formKey, setFormKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const selectedTokenDecimals = useMemo(() => {
    const option = tokenOptions.find((o) => o.value === streamData.token);
    const { SUPPORTED_TOKENS } = getTokenOptions(chain);
    const token =
      SUPPORTED_TOKENS[
        (option?.value || "STRK") as keyof typeof SUPPORTED_TOKENS
      ];
    return token.decimals;
  }, [tokenOptions, streamData.token, chain]);

  const handleFormSubmit = () => {
    if (!address) {
      toast.error("Connect your wallet");
      return;
    }

    // Validate form data
    const schema = createPaymentStreamSchema(tokenOptions, durationOptions);
    const parsed = schema.safeParse(streamData);

    if (!parsed.success) {
      const firstErr = parsed.error.issues[0]?.message || "Invalid form input";
      toast.error(firstErr);
      return;
    }

    // Show confirmation modal
    setShowConfirmationModal(true);
  };

  const handleConfirmStream = async () => {
    // Close modal immediately to show loading state on form
    setShowConfirmationModal(false);

    try {
      setIsSubmitting(true);

      const totalAmountScaled = parseUnits(
        streamData.amount,
        selectedTokenDecimals
      ).toString();

      const result: CreateStreamResponse =
        await PaymentStreamService.createStream(
          account as AccountInterface,
          chain,
          {
            creator: address!,
            name: streamData.name,
            tokenSymbol: streamData.token,
            totalAmount: totalAmountScaled,
            recipient: streamData?.recipient?.toLowerCase(),
            durationValue: Number(streamData.durationValue),
            durationUnit: streamData.duration as DurationUnit,
            cancellable: Boolean(streamData.cancellability),
            transferable: Boolean(streamData.transferability),
          }
        );

      if (!result.success || !result.data) {
        const msg = result.message || "Failed to create stream";
        toast.error(msg);
        return;
      }

      const { transactionHash } = result.data;

      toast.success(
        `Stream created successfully!: ${transactionHash.slice(0, 10)}...`
      );

      // Close modal and reset form
      setShowConfirmationModal(false);
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

      // Invalidate streams queries and set a flag to switch to outgoing tab
      await queryClient.invalidateQueries({
        queryKey: ["payment-streams-table"],
      });

      // Set a temporary query data to indicate tab should switch
      queryClient.setQueryData(["stream-created-switch-tab"], true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create stream";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowConfirmationModal(false);
    }
  };

  return (
    <>
      <main className="flex gap-x-6 h-dvh w-full justify-between">
        <PaymentStreamForm
          key={formKey}
          streamData={streamData}
          tokenOptions={tokenOptions}
          setStreamData={setStreamData}
          durationOptions={durationOptions}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting} // Pass the actual isSubmitting state
        />
        <PaymentStreamSummary streamData={streamData} />
      </main>

      <PaymentStreamConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStream}
        streamData={streamData}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default CreatePaymentStream;
