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
  validateDistribution,
} from "@/lib/utils";
import toast from "react-hot-toast";
import { isDuplicateAddress, isEmptyDistributionData } from "@/validations";
// import { useStarkNameResolver } from "@/hooks/useStarkNameResolver";
import { parseUnits } from "ethers";
import { cairo } from "starknet";
import type { Call } from "starknet";
import { fetchProtocolFee } from "@/lib/api";
import DistributionConfirmationModal from "@/components/modules/distribution/DistributionConfirmationModal";

const DistributePage = () => {
  const { account } = useAccount();

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
    selectedToken: supportedTokens[0].value, // Default to STRK token
    equalAmountType: "amount_per_address",
  });

  const [distributionState, setDistributionState] =
    useState<IDistributionState>({
      totalAmount: "",
      recipientCount: 0,
      protocolFeePercentage: 0,
      currentState: "request-confirmation",
    });

  const defaultEmptyRow = () => Array.from({ length: 3 }, createEmptyRow);

  const [distributionData, setDistributionData] =
    useState<IDistributionData[]>(defaultEmptyRow);

  // const { queueStarkNameResolution } = useStarkNameResolver({
  //   distributionData,
  //   setDistributionData,
  // });

  // Calculate total amount including protocol fee
  const baseAmount = calculateTotalDistributionAmount(distributionData);

  const selectedToken = SUPPORTED_TOKENS[distributionInfo.selectedToken];

  // Derive current contract address and supported tokens based on network
  const CONTRACT_ADDRESS = getContractAddress(isMainNet);

  const handleDistribution = async () => {
    try {
      if (isEmptyDistributionData(distributionData)) {
        toast.error("Please provide valid distribution data.");
        return;
      }

      if (isDuplicateAddress(distributionData)) {
        toast.error("Duplicate address found. Please remove it.");
        return;
      }

      // distributionData.forEach((data, i) => {
      //   const hasSnsAddress = isSnsAddress(data.address!);
      //   const hasSnsName = isSnsAddress(data.starkAddress!);

      //   if (hasSnsAddress) {
      //     queueStarkNameResolution(i, data.address!);
      //     return;
      //   }

      //   if (hasSnsName) {
      //     queueStarkNameResolution(i, data.starkAddress!);
      //     return;
      //   }
      // });

      // const checkDuplicateAddress = distributionType;

      if (distributionInfo.type === "equal") {
        if (distributionInfo.equalAmountType === "amount_per_address") {
          const firstAmount = distributionData[0].amount;

          const hasInvalidAmount = distributionData.some(
            (dist) => dist.amount !== firstAmount
          );

          if (hasInvalidAmount) {
            toast.error(
              "All addresses must have the same amount for equal distribution."
            );

            return;
          }
        }
      }

      // Check if there are any distributions
      const validationErrors: string[] = [];

      distributionData.forEach((dist, index) => {
        // Use resolved address for validation if available

        const validation = validateDistribution(dist.address!, dist.amount);

        if (!validation.isValid && validation.error) {
          validationErrors.push(`Row ${index + 1}: ${validation.error}`);
        }
      });

      if (validationErrors.length > 0) {
        toast.error(
          <div>
            Invalid distributions:
            <ul className="list-disc pl-4 mt-2">
              {validationErrors.map((error) => (
                <li key={error} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        );
        return;
      }

      const baseAmountBigInt = BigInt(
        parseUnits(baseAmount, selectedToken.decimals)
      );

      const {
        message,
        success,
        data: protocolFee,
      } = await fetchProtocolFee({
        account,
        contractAddress: CONTRACT_ADDRESS,
      });

      if (!success) {
        toast.error(message);
        return;
      }

      const protocolFeeBigInt =
        (baseAmountBigInt * BigInt(protocolFee!)) / BigInt(10000);

      const totalAmountWithFee = baseAmountBigInt + protocolFeeBigInt;

      const totalAmountString = (
        Number(totalAmountWithFee) /
        10 ** selectedToken.decimals
      ).toString();

      setDistributionState((prev) => ({
        ...prev,
        totalAmount: totalAmountString,
        currentState: "request-confirmed",
        protocolFeePercentage: protocolFee!,
        recipientCount: distributionData.length,
      }));
    } catch (error) {
      setDistributionState((prev) => ({
        ...prev,
        currentState: "request-confirmation",
      }));

      type ErrorWithCode = Error & { code: string };

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
    setDistributionState((prev) => ({
      ...prev,
      currentState: "process-started",
    }));

    try {
      toast.loading("Processing distributions...", {
        duration: Number.POSITIVE_INFINITY,
      });

      // Use resolved addresses for the contract call
      const recipients = distributionData.map(
        (dist) => dist.address
      ) as string[];

      const amounts = distributionData.map((dist) =>
        BigInt(parseUnits(dist.amount, selectedToken.decimals))
      );

      const totalAmount = amounts.reduce(
        (sum, amount) => sum + BigInt(amount),
        BigInt(0)
      );

      // Calculate protocol fee
      const protocolFee =
        (totalAmount * BigInt(distributionState.protocolFeePercentage)) /
        BigInt(10000);

      const totalAmountWithFee = totalAmount + protocolFee;

      const low =
        totalAmountWithFee & BigInt("0xffffffffffffffffffffffffffffffff");

      const high = totalAmountWithFee >> BigInt(128);

      let result = {} as {
        transaction_hash: string;
      };

      let calls: Call[];

      if (distributionInfo.type === "equal") {
        const amountPerRecipient = cairo.uint256(amounts[0]);

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
              amounts.length.toString(),
              ...amounts.flatMap((amount) => {
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

      // Wait for receipt
      const receiptStatus = await account!.waitForTransaction(tx);

      console.log({ receiptStatus });

      // Create distribution record

      if (receiptStatus.statusReceipt === "success") {
      }

      toast.dismiss();

      toast.success(
        `Successfully distributed tokens to ${recipients.length} addresses`,
        { duration: 10000 }
      );
    } catch (error) {
      console.log("Error:", error);
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
        setDistributionType={setDistributionInfo}
      />
      <DistributionFileUpload setDistributionData={setDistributionData} />
      <DistributionTable
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
