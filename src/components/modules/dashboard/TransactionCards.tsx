"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@starknet-react/core";

import { formatThousandNumber } from "@/lib/utils";

import TransactionCard from "./TransactionCard";
import TransactionSkeletonLoader from "./TransactionSkeletonLoader";
import DistributionApiService from "@/services/api/distributionService";

const TransactionCards = () => {
  const { address } = useAccount();

  const { data: totalDistributionAmount, isFetching } = useQuery({
    queryKey: ["totalDistributionAmount"],
    queryFn: () => DistributionApiService.getDistributionStats(address!),
    enabled: !!address,
    refetchOnWindowFocus: true,
  });

  if (isFetching) return <TransactionSkeletonLoader />;

  const {
    totalAmount,
    totalDistributions,
    totalFundedAddresses,
    totalAmountPercentageChange,
    totalDistributionsPercentageChange,
    totalFundedAddressesPercentageChange,
  } = totalDistributionAmount?.data ?? {};

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 md:gap-8">
      <TransactionCard
        type="amount"
        title="Total Amount Sent"
        isWalletConnected={!!address}
        amount={`$${formatThousandNumber(!address ? 0 : totalAmount ?? 0)}`}
        percentage={totalAmountPercentageChange ?? 0}
      />

      <TransactionCard
        type="distributions"
        isWalletConnected={!!address}
        title="Total Distribution Made"
        amount={formatThousandNumber(!address ? 0 : totalDistributions ?? 0)}
        percentage={totalDistributionsPercentageChange ?? 0}
      />

      <TransactionCard
        type="addresses"
        title="Total Address Funded"
        isWalletConnected={!!address}
        amount={formatThousandNumber(!address ? 0 : totalFundedAddresses ?? 0)}
        percentage={totalFundedAddressesPercentageChange ?? 0}
      />
    </div>
  );
};

export default TransactionCards;
