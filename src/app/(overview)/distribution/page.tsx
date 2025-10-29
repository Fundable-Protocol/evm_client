"use client";

import toast from "react-hot-toast";  
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import currency from "currency.js";
import { useAccount, useSendCalls, useWriteContract } from "wagmi";
import { encodeFunctionData, type Abi, type TransactionReceipt } from "viem";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import DistributionFileUpload from "@/components/modules/distribution/DistributionFileUpload";
import DistributionTable from "@/components/modules/distribution/DistributionTable";
import {
  IDistributionData,
  IDistributionState,
  IDistributionInfo,
  DistributionType,
} from "@/types/distribution";
import DistributionSelector from "@/components/modules/distribution/DistributionSelector";

import {
  tryCatch,
  createEmptyRow,
  getContractAddress,
  getSupportedTokens,
  calculateTotalDistributionAmount,
} from "@/lib/utils";

import {
  // snsAddressValidation,
  validateDistributionAmounts,
  checkDistributionDataValidity,
  validateIndividualDistributions,
} from "@/validations/distribution";
import { ErrorWithCode } from "@/types";
// import { useStarkNameResolver } from "@/hooks/useStarkNameResolver";
import DistributionApiService from "@/services/api/distributionService";
import {
  DistributionSuccessModal,
  DistributionConfirmationModal,
  TwitterAddressExtractor,
} from "@/components/modules/distribution";
import { getBalance, waitForCallsStatus, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/config";
import { fetchProtocolFee } from "@/lib/api";
import { fetchTokenPrices } from "@/services/apiServices";
import { EIP_7702_CHAINS } from "@/lib/constant";
import { resendDistributionPayload } from "@/store/distributionEntity";
import { DistributionAttributes } from "@/types/distribution";

const DistributePage = () => {
  const { address, chain } = useAccount();
  const { sendCallsAsync } = useSendCalls();
  const { writeContractAsync } = useWriteContract();
  // const { data: callReceipts, isSuccess, isError } = useWaitForCallsStatus({
  //   id: bundle?.id,
  //   pollingInterval: 1000,
  // });
  // console.log("callReceipts", callReceipts);
  const chainNames = ["base", "ethereum", "bnb smart chain", "arbitrum", "lisk"];
  const chainName = chain?.name?.toLowerCase() || "";
  const isEip7702Chain = (EIP_7702_CHAINS as readonly string[]).includes(chainName);
  console.log("chainName", chainName);

  const router = useRouter();
  const isMainNet = chainNames.includes(chainName);
  const network = isMainNet ? "mainnet" : "testnet";
  const SUPPORTED_TOKENS = getSupportedTokens(network, chainName);
  console.log("SUPPORTED_TOKENS", SUPPORTED_TOKENS);

  const supportedTokens = useMemo(() => Object.values(SUPPORTED_TOKENS).map((token) => ({
    label: token.symbol,
    value: token.symbol,
  })), [SUPPORTED_TOKENS]);

  const [distributionInfo, setDistributionInfo] = useState<IDistributionInfo>({
    amount: 0,
    type: "equal",
    twitterUrl: "",
    showLabel: false,
    equalAmountType: "amount_per_address",
    selectedToken: supportedTokens[0]?.value || "USDC", // Default to USDC or first available token
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

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedDistribution, setCompletedDistribution] = useState<DistributionAttributes | null>(null);

  // Prefill from resend payload if available
  useEffect(() => {
    const payload = resendDistributionPayload.get();
    if (!payload) return;

    // Map token by symbol if available in current chain/token list
    const tokenSymbol = payload.token_symbol || supportedTokens[0]?.value || "USDC";
    const tokenExistsOnChain = supportedTokens.some((t) => t.value.toLowerCase() === tokenSymbol.toLowerCase());
    const selectedTokenSymbol = tokenExistsOnChain ? tokenSymbol : (supportedTokens[0]?.value || "USDC");

    // Determine type and equalAmountType
    const type = (payload.distribution_type?.toLowerCase() as IDistributionInfo["type"]) || "equal";
    const recipients = payload.metadata?.recipients || payload.recipients || [];
    const hasAnyLabel = recipients.some((r) => !!r.label);

    setDistributionInfo((prev) => ({
      ...prev,
      type,
      showLabel: hasAnyLabel,
      equalAmountType: type === "equal" ? "amount_per_address" : prev.equalAmountType,
      selectedToken: selectedTokenSymbol,
      amount: type === "equal" ? Number(recipients?.[0]?.amount ?? 0) : 0,
    }));

    // Populate rows
    const rows: IDistributionData[] = (recipients.length ? recipients : []).map((r) =>
      createEmptyRow({
        id: "", // will be replaced by createEmptyRow
        address: r.address,
        amount: String(r.amount ?? ""),
        label: r.label ?? "",
      })
    );

    setDistributionData(rows.length ? rows : [createEmptyRow()]);

    // Clear payload after applying
    resendDistributionPayload.set(null);
  }, [supportedTokens]);

  // const { queueStarkNameResolution } =
  //   useStarkNameResolver(setDistributionData);

  // Calculate total amount including protocol fee
  const selectedToken = SUPPORTED_TOKENS[distributionInfo.selectedToken] || {
    symbol: "USDC",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 6,
  };

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

      const erc20ApproveAbi = [{
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
      }] as const satisfies Abi;

      const approveCall = {
        to: selectedToken.address as `0x${string}`,
        data: encodeFunctionData({
          abi: erc20ApproveAbi,
          functionName: 'approve',
          args: [CONTRACT_ADDRESS as `0x${string}`, totalAmountWithFee]
        })
      };

      const distributionAbi = [{
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
      }] as const satisfies Abi;

      const distributeCall = {
        to: CONTRACT_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
          abi: distributionAbi,
          functionName: distributionInfo.type === 'equal' ? 'distribute' : 'distribute_weighted',
          args: distributionInfo.type === 'equal'
            ? [amounts![0], recipients, selectedToken.address as `0x${string}`]
            : [amounts!, recipients, selectedToken.address as `0x${string}`]
        })
      };

     let transactionHash: `0x${string}` | undefined;

     if (isEip7702Chain) {
       const result = await sendCallsAsync({ calls: [approveCall, distributeCall] });
       console.log("result", result);

       const { receipts } = await waitForCallsStatus(config, {
        id: result?.id,
        pollingInterval: 1000,
       });

       transactionHash = receipts?.[0]?.transactionHash as `0x${string}` | undefined;
     } else {
       toast.dismiss();
       toast.loading("Approving tokens...", {
         duration: Number.POSITIVE_INFINITY,
       });

       // Fallback: send sequential transactions
       const approveHash = await writeContractAsync({
         address: selectedToken.address as `0x${string}`,
         abi: erc20ApproveAbi,
         functionName: 'approve',
         args: [CONTRACT_ADDRESS as `0x${string}`, totalAmountWithFee]
       });
       await waitForTransactionReceipt(config, { hash: approveHash });

       toast.dismiss();
       toast.loading("Distributing tokens...", {
         duration: Number.POSITIVE_INFINITY,
       });

       const distributeHash = await writeContractAsync({
         address: CONTRACT_ADDRESS as `0x${string}`,
         abi: distributionAbi,
         functionName: distributionInfo.type === 'equal' ? 'distribute' : 'distribute_weighted',
         args: distributionInfo.type === 'equal'
           ? [amounts![0], recipients, selectedToken.address as `0x${string}`]
           : [amounts!, recipients, selectedToken.address as `0x${string}`]
       });
       const distributeReceipt: TransactionReceipt = await waitForTransactionReceipt(config, { hash: distributeHash });
       // Prefer the receipt's hash if available
       transactionHash = distributeReceipt.transactionHash ?? distributeHash;
     }

     if (!transactionHash) {
      throw new Error("Transaction failed, check Onchain History for more details");
     }

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
        status: "PENDING",
        transaction_hash: transactionHash,
        user_address: address!,
        chain_name: chain?.name ?? "",
        total_amount: baseAmount,
        usd_rate: usdRate?.toString(),
        total_usd_amount: totalUsdAmount,
        token_symbol: selectedToken.symbol,
        created_at: new Date().toISOString(),
        token_address: selectedToken.address,
        token_decimals: selectedToken.decimals,
        total_recipients: distributionData.length,
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

      const { error, data } = await tryCatch(
        DistributionApiService.createDistribution(address!, distribution as unknown as DistributionAttributes)
      );

      if (!data?.success) {
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

      // Create distribution object for success modal
      const distributionForModal: DistributionAttributes = {
        id: "", // Will be set by backend
        user_address: address!,
        token_address: selectedToken.address,
        token_symbol: selectedToken.symbol,
        token_decimals: selectedToken.decimals,
        total_amount: baseAmount,
        fee_amount: (Number(distributionState.protocolFee || BigInt(0)) / Math.pow(10, selectedToken.decimals)).toString(),
        transaction_hash: transactionHash,
        total_recipients: distributionData.length,
        status: "completed",
        distribution_type: distributionInfo.type.toUpperCase() as DistributionType,
        block_number: null,
        block_timestamp: null,
        network: isMainNet ? "mainnet" : "testnet",
        chain_name: chain?.name || "",
        created_at: new Date(),
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

      // Set completed distribution and show success modal
      setCompletedDistribution(distributionForModal);
      setShowSuccessModal(true);
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

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCompletedDistribution(null);
    router.push(`/history`);
  };

  const handleViewHistory = () => {
    setShowSuccessModal(false);
    setCompletedDistribution(null);
    router.push(`/history`);
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

      <TwitterAddressExtractor
        address={address!}
        distributionInfo={distributionInfo}
        setDistributionInfo={setDistributionInfo}
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
      
      {completedDistribution && (
        <DistributionSuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          onViewHistory={handleViewHistory}
          distribution={completedDistribution}
        />
      )}
    </DashboardLayout>
  );
};

export default DistributePage;