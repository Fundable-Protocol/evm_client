"use client";

import toast from "react-hot-toast";  
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import currency from "currency.js";
import { useAccount, useSendCalls} from "wagmi";
import { encodeFunctionData } from "viem";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import DistributionFileUpload from "@/components/modules/distribution/DistributionFileUpload";
import DistributionTable from "@/components/modules/distribution/DistributionTable";
import {
  IDistributionData,
  IDistributionState,
  IDistributionInfo,
} from "@/types/distribution";
import DistributionSelector from "@/components/modules/distribution/DistributionSelector";

import {
  tryCatch,
  createEmptyRow,
  getContractAddress,
  getSupportedTokens,
  calculateTotalDistributionAmount,
} from "@/lib/utills";

import {
  // snsAddressValidation,
  validateDistributionAmounts,
  checkDistributionDataValidity,
  validateIndividualDistributions,
} from "@/validations/distribution";
import { ErrorWithCode } from "@/types";
// import { useStarkNameResolver } from "@/hooks/useStarkNameResolver";
import { createDistributionAction } from "@/app/actions/distributionActions";
import DistributionConfirmationModal from "@/components/modules/distribution/DistributionConfirmationModal";
import { getBalance, waitForCallsStatus } from "@wagmi/core";
import { config } from "@/config";
import { fetchProtocolFee } from "@/lib/api";
import { fetchTokenPrices } from "@/services/apiServices";

const DistributePage = () => {
  const { address, chain } = useAccount();
  const { sendCallsAsync } = useSendCalls();
  // const { data: callReceipts, isSuccess, isError } = useWaitForCallsStatus({
  //   id: bundle?.id,
  //   pollingInterval: 1000,
  // });
  // console.log("callReceipts", callReceipts);
  const chainNames = ["base", "ethereum", "bnb smart chain", "arbitrum"];
  const chainName = chain?.name?.toLowerCase() || "";
  console.log("chainName", chainName);

  const router = useRouter();
  const isMainNet = chainNames.includes(chainName);
  const network = isMainNet ? "mainnet" : "testnet";
  const SUPPORTED_TOKENS = getSupportedTokens(network, chainName);
  console.log("SUPPORTED_TOKENS", SUPPORTED_TOKENS);

  const supportedTokens = Object.values(SUPPORTED_TOKENS).map((token) => ({
    label: token.symbol,
    value: token.symbol,
  }));

  const [distributionInfo, setDistributionInfo] = useState<IDistributionInfo>({
    amount: 0,
    type: "equal",
    showLabel: false,
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

  // const { queueStarkNameResolution } =
  //   useStarkNameResolver(setDistributionData);

  // Calculate total amount including protocol fee
  const selectedToken = SUPPORTED_TOKENS[distributionInfo.selectedToken];

  // Derive current contract address and supported tokens based on network
  const CONTRACT_ADDRESS = getContractAddress();

  const handleDistribution = async () => {
    try {
      setDistributionState((prev) => ({
        ...prev,
        currentState: "initiate-distribution",
      }));

      // Create updated distribution data for calculations
      let updatedDistributionData = distributionData;

      const { success: dataValiditySuccess, message: dataValidityMessage } =
        checkDistributionDataValidity(
          updatedDistributionData,
          distributionInfo
        );

      if (!dataValiditySuccess) throw new Error(dataValidityMessage);

      const isAmountPerAddressDistribution =
        distributionInfo.type === "equal" &&
        distributionInfo.equalAmountType === "amount_per_address";

      if (isAmountPerAddressDistribution) {
        updatedDistributionData = distributionData.map((data) => ({
          ...data,
          amount: String(distributionInfo.amount),
        }));

        // Update state for UI
        setDistributionData(updatedDistributionData);
      }

      // Check for unresolved SNS addresses before validation

      // const { success, message } = snsAddressValidation(
      //   updatedDistributionData,
      //   queueStarkNameResolution,
      //   isMainNet
      // );

      // if (!success) throw new Error(message!);

      const {
        success: equalDistributionSuccess,
        message: equalDistributionMessage,
      } = await validateDistributionAmounts({
        distributionInfo,
        distributionData: updatedDistributionData,
      });

      if (!equalDistributionSuccess) {
        throw new Error(equalDistributionMessage!);
      }

      // Now validate individual distributions after ensuring no SNS addresses
      const {
        success: individualValidationSuccess,
        message: individualValidationMessage,
      } = validateIndividualDistributions(updatedDistributionData);

      if (!individualValidationSuccess) {
        throw new Error(individualValidationMessage!);
      }

      // const {
      //   message: protocolFeeMessage,
      //   success: protocolFeeSuccess,
      //   data: protocolFeePercentage,
      // } = await fetchProtocolFee({
      //   account,
      //   contractAddress: CONTRACT_ADDRESS,
      // });

      // if (!protocolFeeSuccess) {
      //   throw new Error(protocolFeeMessage);
      // }

      const {
        // message: protocolFeeMessage,
        // success: protocolFeeSuccess,
        data: protocolFeePercentage,
      } = await fetchProtocolFee(isMainNet ? "mainnet" : "testnet", "Starknet");

      console.log("protocolFeePercentage", protocolFeePercentage);

      // const protocolFeePercentage = 2500;

      const { totalAmountString, amounts, protocolFee, totalAmount } =
        calculateTotalDistributionAmount(
          updatedDistributionData,
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
        recipientCount: updatedDistributionData.length,
        protocolFeePercentage: protocolFeePercentage!,
      }));
    } catch (error) {
      if ((error as ErrorWithCode)?.code === "INVALID_ARGUMENT") {
        toast.error("Invalid amount — please provide a valid amount");
      } else if ((error as ErrorWithCode)?.message) {
        toast.error((error as ErrorWithCode)?.message);
      } else {
        toast.error("Something went wrong, please refresh.");
      }

      setDistributionState((prev) => ({
        ...prev,
        currentState: "request-confirmation",
      }));

      return;
    }
  };

  const handleModalConfirmation = async () => {
    try {
      setDistributionState((prev) => ({
        ...prev,
        currentState: "process-started",
      }));

      toast.loading("Processing distributions...", {
        duration: Number.POSITIVE_INFINITY,
      });

      const recipients = distributionData.map(
        (dist) => dist.address as `0x${string}`
      );

      const {
        protocolFee,
        totalAmount,
        distributionAmountsBigInt: amounts,
      } = {
        ...distributionState,
      };

      const totalAmountWithFee = totalAmount! + protocolFee!;

      const userDetails = await getBalance(config, {
        address: address!,
        token: selectedToken.address as `0x${string}`,
      });

      const userBalance = userDetails.value;

      if (userBalance < totalAmountWithFee) {
        throw new Error("Insufficient balance");
      }

      const approveCall = {
        to: selectedToken.address as `0x${string}`,
        data: encodeFunctionData({
          abi: [{
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          }],
          functionName: 'approve',
          args: [CONTRACT_ADDRESS as `0x${string}`, totalAmountWithFee]
        })
      };

      const distributeCall = {
        to: CONTRACT_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
          abi: [{
            name: distributionInfo.type === 'equal' ? 'distribute' : 'distribute_weighted',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: distributionInfo.type === 'equal' 
              ? [
                  { name: 'amount', type: 'uint256' },
                  { name: 'recipients', type: 'address[]' },
                  { name: 'token', type: 'address' }
                ]
              : [
                  { name: 'amounts', type: 'uint256[]' },
                  { name: 'recipients', type: 'address[]' },
                  { name: 'token', type: 'address' }
                ],
            outputs: []
          }],
          functionName: distributionInfo.type === 'equal' ? 'distribute' : 'distribute_weighted',
          args: distributionInfo.type === 'equal'
            ? [amounts![0], recipients, selectedToken.address as `0x${string}`]
            : [amounts!, recipients, selectedToken.address as `0x${string}`]
        })
      };

     const result = await sendCallsAsync({ calls: [approveCall, distributeCall] });
     console.log("result", result);

     const { receipts } = await waitForCallsStatus(config, {
      id: result?.id,
      pollingInterval: 1000,
     });

     const transactionHash = receipts?.[0]?.transactionHash;

     if (!transactionHash) {
      throw new Error("Transaction failed, check Onchain History for more details");
     }
    //  console.log("callReceipts", callReceipts);

      // Wait for transaction to be mined and successful
      // if (isError) {
      //   throw new Error("Transaction failed");
      // }

      // console.log("callReceipts", callReceipts);

      // if (!isSuccess || !callReceipts?.receipts?.[0]?.transactionHash) {
      //   throw new Error("Transaction not confirmed");
      // }

      const baseAmount = distributionData
        .reduce((sum, dist) => {
          return sum + Number.parseFloat(dist.amount);
        }, 0)
        .toString();

      const { data: tokenPrices } = await tryCatch(
        fetchTokenPrices(["starknet", "ethereum"])
      );

      let usdRate =
      selectedToken.symbol === "STRK"
        ? tokenPrices?.["starknet"]?.usd ?? 1
        : selectedToken.symbol === "ETH"
        ? tokenPrices?.["ethereum"]?.usd ?? 1
        : 1;

      const totalBaseAmount = currency(baseAmount, {
        precision: 6,
      });

      usdRate = currency(usdRate ?? 0, {
        precision: 6,
      }).value;

      const totalUsdAmount = totalBaseAmount.multiply(usdRate).toString();

      const distribution = {
        status: "COMPLETED",
        transaction_hash: transactionHash,
        user_address: address!,
        total_amount: baseAmount,
        total_usd_amount: totalUsdAmount,
        token_symbol: selectedToken.symbol,
        token_address: selectedToken.address,
        token_decimals: selectedToken.decimals,
        total_recipients: distributionData.length,
        chain_name: chain?.name || "",
        usd_rate: usdRate?.toString(),
        network: isMainNet ? "MAINNET" : "TESTNET",
        distribution_type: distributionInfo.type.toUpperCase(),
        fee_amount: (Number(distributionState.protocolFee || BigInt(0)) / Math.pow(10, selectedToken.decimals)).toString(),
        metadata: {
          recipients: distributionData.map((d) => ({
            address: d.address!,
            amount: d.amount!,
            ...(distributionInfo.showLabel && d.label
              ? { label: d.label }
              : {}),
          })),
        },
      };

      console.log("distribution", distribution);

      const { error, success } = await tryCatch(
        createDistributionAction(distribution)
      );

      if (!success) {
        toast.error(error?.message || "Something went wrong");
        return;
      }

      setDistributionData([createEmptyRow()]);

      if (distributionInfo.type === "equal") {
        setDistributionInfo((prev) => ({
          ...prev,
          amount: 0,
        }));
      }

      toast.dismiss();

      toast.success(
        `Successfully distributed tokens to ${recipients.length} addresses`,
        { duration: 800 }
      );

      router.push(`/history`);
    } catch (error) {
      if (error instanceof Error) {
        toast.dismiss();
        toast.error(error.message);
      } else {
        toast.dismiss();
        toast.error("Distribution failed, please try again.");
      }
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

  const disableDistributionBtn =
    !!address ||
    ["process-started", "initiate-distribution"].includes(
      distributionState.currentState
    );

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
      <DistributionFileUpload
        distributionType={distributionInfo}
        setDistributionData={setDistributionData}
      />
      <DistributionTable
        isConnected={disableDistributionBtn}
        distributionType={distributionInfo}
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