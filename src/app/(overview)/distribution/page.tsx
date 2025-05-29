"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DistributionFileUpload from "@/components/modules/distribution/DistributionFileUpload";
import DistributionTable from "@/components/modules/distribution/DistributionTable";
import { IDistributionType } from "@/types/distribution";
import { useNetwork } from "@starknet-react/core";
import DistributionSelector from "@/components/modules/distribution/DistributionSelector";
import { getSupportedTokens } from "@/lib/utils";

const DistributePage = () => {
  // const { address, status, account } = useAccount();

  const { chain } = useNetwork();

  const isMainNet = chain.network === "mainnet";

  const SUPPORTED_TOKENS = getSupportedTokens(isMainNet);

  const supportedTokens = Object.values(SUPPORTED_TOKENS).map((token) => ({
    label: token.symbol,
    value: token.symbol,
  }));

  const [distributionType, setDistributionType] = useState<IDistributionType>({
    amount: 0,
    type: "equal",
    selectedToken: supportedTokens[0].value, // Default to STRK token
    equalAmountType: "amount_per_address",
  });
  // Derive current contract address and supported tokens based on network
  // const CONTRACT_ADDRESS = getContractAddress(isMainNet);

  return (
    <DashboardLayout
      title="Create Distribution"
      className="flex flex-col gap-y-6 h-full "
    >
      <DistributionSelector
        supportedTokens={supportedTokens}
        distributionType={distributionType}
        setDistributionType={setDistributionType}
      />
      <DistributionFileUpload />
      <DistributionTable />
    </DashboardLayout>
  );
};

export default DistributePage;
