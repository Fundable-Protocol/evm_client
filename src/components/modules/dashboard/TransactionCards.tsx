"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@starknet-react/core";

import { formatThousandNumber } from "@/lib/utils";

import TransactionCard from "./TransactionCard";
import TransactionSkeletonLoader from "./TransactionSkeletonLoader";
import { getCardStatsAction } from "@/app/actions/distributionActions";

const TransactionCards = () => {
  const { address } = useAccount();

  const { data: totalDistributionAmount, isPending } = useQuery({
    queryKey: ["totalDistributionAmount"],
    queryFn: () => getCardStatsAction(address!),
    enabled: !!address,
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
  });

  if (isPending) return <TransactionSkeletonLoader />;

  const {
    totalAmount,
    totalAmountPercentageChange,
    totalDistributions,
    totalDistributionsPercentageChange,
    totalFundedAddresses,
    totalFundedAddressesPercentageChange,
  } = totalDistributionAmount ?? {};

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 md:gap-8">
      <TransactionCard
        type="amount"
        title="Total Amount Sent"
        amount={`$${formatThousandNumber(!address ? 0 : totalAmount ?? 0)}`}
        percentage={totalAmountPercentageChange ?? 0}
      />

      <TransactionCard
        type="distributions"
        title="Total Distribution Made"
        amount={formatThousandNumber(!address ? 0 : totalDistributions ?? 0)}
        percentage={totalDistributionsPercentageChange ?? 0}
      />

      <TransactionCard
        type="addresses"
        title="Total Address Funded"
        amount={formatThousandNumber(!address ? 0 : totalFundedAddresses ?? 0)}
        percentage={totalFundedAddressesPercentageChange ?? 0}
      />
    </div>
  );
};

export default TransactionCards;
