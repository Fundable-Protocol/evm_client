"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DistributionFileUpload from "@/components/modules/distribution/DistributionFileUpload";
import DistributionTable from "@/components/modules/distribution/DistributionTable";
import {
  IDistributionData,
  IDistributionState,
  IDistributionType,
} from "@/types/distribution";
import { useAccount, useNetwork } from "@starknet-react/core";
import DistributionSelector from "@/components/modules/distribution/DistributionSelector";
import {
  calculateTotalDistributionAmount,
  createEmptyRow,
  getContractAddress,
  getSupportedTokens,
  tryCatch,
} from "@/lib/utils";
import toast from "react-hot-toast";
import { isSnsAddress } from "@/validations";
import { useStarkNameResolver } from "@/hooks/useStarkNameResolver";

import { cairo } from "starknet";
import type { Call } from "starknet";
import { fetchProtocolFee } from "@/lib/api";
import DistributionConfirmationModal from "@/components/modules/distribution/DistributionConfirmationModal";
import {
  checkDistributionDataValidity,
  calculateDistributionAmounts,
  validateIndividualDistributions,
} from "@/validations/distribution";
import { ErrorWithCode } from "@/types";
import { createDistributionAction } from "@/app/actions/distributionActions";

const DistributePage = () => {
  const { account, address } = useAccount();

  const { chain } = useNetwork();

  const isMainNet = chain.network === "mainnet";

  const SUPPORTED_TOKENS = getSupportedTokens(isMainNet);

  const supportedTokens = Object.values(SUPPORTED_TOKENS).map((token) => ({
    label: token.symbol,
    value: token.symbol,
  }));

  const [distributionInfo, setDistributionInfo] = useState<IDistributionType>({
    amount: 0,
    type: "equal",
    equalAmountType: "amount_per_address",
    selectedToken: supportedTokens[0].value, // Default to STRK token
  });

  const [distributionState, setDistributionState] =
    useState<IDistributionState>({
      recipientCount: 0,
      protocolFeePercentage: 0,
      currentState: "request-confirmation",
    });

  const [distributionData, setDistributionData] = useState<IDistributionData[]>(
    [createEmptyRow()]
  );

  const { queueStarkNameResolution } = useStarkNameResolver({
    distributionData,
    setDistributionData,
  });

  // Calculate total amount including protocol fee
  const selectedToken = SUPPORTED_TOKENS[distributionInfo.selectedToken];

  // Derive current contract address and supported tokens based on network
  const CONTRACT_ADDRESS = getContractAddress(isMainNet);

  const handleDistribution = async () => {
    try {
      const { success: dataValiditySuccess, message: dataValidityMessage } =
        checkDistributionDataValidity(distributionData);

      if (!dataValiditySuccess) {
        toast.error(dataValidityMessage);
        return;
      }

      distributionData.forEach((data, i) => {
        const hasSnsAddress = isSnsAddress(data.address!);
        const hasSnsName = isSnsAddress(data.starkAddress!);

        if (hasSnsAddress) {
          queueStarkNameResolution(i, data.address!);
          return;
        }

        if (hasSnsName) {
          queueStarkNameResolution(i, data.starkAddress!);
          return;
        }
      });

      const {
        success: equalDistributionSuccess,
        message: equalDistributionMessage,
      } = await calculateDistributionAmounts({
        distributionInfo,
        distributionData,
        setDistributionData,
      });

      if (!equalDistributionSuccess) {
        toast.error(equalDistributionMessage!);
        return;
      }

      // const {
      //   message,
      //   success,
      //   data: protocolFeePercentage,
      // } = await fetchProtocolFee({
      //   account,
      //   contractAddress: CONTRACT_ADDRESS,
      // });

      // if (!success) {
      //   toast.error(message);
      //   return;
      // }

      const protocolFeePercentage = 2500;

      const { totalAmountString, amounts, protocolFee, totalAmount } =
        calculateTotalDistributionAmount(
          distributionData,
          selectedToken,
          protocolFeePercentage
        );

      setDistributionState((prev) => ({
        ...prev,
        totalAmount,
        protocolFee,
        currentState: "request-confirmed",
        distributionAmountsBigInt: amounts,
        displayableAmount: totalAmountString,
        recipientCount: distributionData.length,
        protocolFeePercentage: protocolFeePercentage!,
      }));
    } catch (error) {
      if ((error as ErrorWithCode)?.code === "INVALID_ARGUMENT") {
        toast.error("Invalid amount — please provide a valid amount");
        return;
      } else {
        toast.error("Something went wrong, please refresh.");
      }

      return;
    }
  };

  const handleModalConfirmation = async () => {
    const {
      success: individualValidationSuccess,
      message: individualValidationMessage,
    } = validateIndividualDistributions(distributionData);

    if (!individualValidationSuccess) {
      toast.error(individualValidationMessage!);
      return;
    }

    try {
      setDistributionState((prev) => ({
        ...prev,
        currentState: "process-started",
      }));

      toast.loading("Processing distributions...", {
        duration: Number.POSITIVE_INFINITY,
      });

      // Use resolved addresses for the contract call
      const recipients = distributionData.map(
        (dist) => dist.address
      ) as string[];

      const {
        protocolFee,
        totalAmount,
        distributionAmountsBigInt: amounts,
      } = {
        ...distributionState,
      };

      const totalAmountWithFee = totalAmount! + protocolFee!;

      const low =
        totalAmountWithFee & BigInt("0xffffffffffffffffffffffffffffffff");

      const high = totalAmountWithFee >> BigInt(128);

      let result = {} as {
        transaction_hash: string;
      };

      let calls: Call[];

      if (distributionInfo.type === "equal") {
        const amountPerRecipient = cairo.uint256(amounts![0]);

        calls = [
          {
            entrypoint: "approve",
            contractAddress: selectedToken.address,
            calldata: [CONTRACT_ADDRESS, low.toString(), high.toString()],
          },
          {
            entrypoint: "distribute",
            contractAddress: CONTRACT_ADDRESS,
            calldata: [
              amountPerRecipient.low,
              amountPerRecipient.high,
              recipients.length.toString(),
              ...recipients,
              selectedToken.address,
            ],
          },
        ];
      } else {
        calls = [
          {
            entrypoint: "approve",
            contractAddress: selectedToken.address,
            calldata: [CONTRACT_ADDRESS, low.toString(), high.toString()],
          },
          {
            entrypoint: "distribute_weighted",
            contractAddress: CONTRACT_ADDRESS,
            calldata: [
              amounts!.length.toString(),
              ...amounts!.flatMap((amount) => {
                const uint256Value = cairo.uint256(amount);
                return [uint256Value.low, uint256Value.high];
              }),
              recipients.length.toString(),
              ...recipients,
              selectedToken.address,
            ],
          },
        ];
      }

      result = await account!.execute(calls);
      const tx = result.transaction_hash;

      // // Wait for receipt
      const receiptStatus = await account!.waitForTransaction(tx);

      // Create distribution record

      if (receiptStatus.statusReceipt !== "success") {
        throw new Error("Distribution failed, please try again.");
      }

      //  const distributionsWithLabels = distributions.map((dist, index) => ({
      //    ...dist,
      //    label: labels[index],
      //  }));

      const baseAmount = distributionData
        .reduce((sum, dist) => {
          return sum + Number.parseFloat(dist.amount);
        }, 0)
        .toString();

      const distribution = {
        status: "COMPLETED",
        transaction_hash: tx,
        user_address: address!,
        total_amount: baseAmount,
        token_symbol: selectedToken.symbol,
        token_address: selectedToken.address,
        token_decimals: selectedToken.decimals,
        total_recipients: distributionData.length,
        network: isMainNet ? "MAINNET" : "TESTNET",
        distribution_type: distributionInfo.type.toUpperCase(),
        fee_amount: distributionState.protocolFee?.toString() || "0",
        metadata: {
          recipients: distributionData.map((d) => ({
            address: d.address!,
            amount: d.amount!,
            // ...(showLabels && d.label ? { label: d.label } : {}),
          })),
        },
      };

      const { error, success } = await tryCatch(
        createDistributionAction(distribution)
      );

      if (!success) {
        toast.error(error?.message || "Something went wrong");
        return;
      }

      toast.dismiss();

      toast.success(
        `Successfully distributed tokens to ${recipients.length} addresses`,
        { duration: 1000 }
      );
    } catch {
      toast.error("Distribution failed, please try again.");
    } finally {
      setDistributionState((prev) => ({
        ...prev,
        currentState: "process-completed",
      }));
    }
  };

  const handleModalClose = () => {
    setDistributionState((prev) => ({
      ...prev,
      currentState: "process-completed",
    }));
  };

  return (
    <DashboardLayout
      title="Create Distribution"
      className="flex flex-col gap-y-6 h-full"
    >
      <DistributionSelector
        supportedTokens={supportedTokens}
        distributionType={distributionInfo}
        distributionData={distributionData}
        setDistributionType={setDistributionInfo}
        setDistributionData={setDistributionData}
      />
      <DistributionFileUpload setDistributionData={setDistributionData} />
      <DistributionTable
        isConnected={
          distributionState.currentState === "process-started" || !!account
        }
        distributionData={distributionData}
        handleDistribution={handleDistribution}
        setDistributionData={setDistributionData}
      />
      <DistributionConfirmationModal
        isOpen={distributionState.currentState === "request-confirmed"}
        onClose={handleModalClose}
        onConfirm={handleModalConfirmation}
        distributionState={{
          ...distributionState,
          selectedToken: selectedToken["symbol"],
        }}
      />
    </DashboardLayout>
  );
};

export default DistributePage;
