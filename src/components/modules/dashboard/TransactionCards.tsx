"use client";

import { formatThousandNumber } from "@/lib/utils";
import TransactionCard from "./TransactionCard";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@starknet-react/core";
import { getCardStatsAction } from "@/app/actions/distributionActions";
import TransactionCardSkeleton from "./TransactionCardSkeleton";

const TransactionCards = () => {
  const { address } = useAccount();

  const { data: totalDistributionAmount, isLoading } = useQuery({
    queryKey: ["totalDistributionAmount"],
    queryFn: () => getCardStatsAction(address!),
    enabled: !!address,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 md:gap-8">
        <TransactionCardSkeleton />
        <TransactionCardSkeleton />
        <TransactionCardSkeleton />
      </div>
    );
  }

  const { totalAmount, totalDistributions, totalFundedAddresses } =
    totalDistributionAmount ?? {};

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 md:gap-8">
      <TransactionCard
        type="amount"
        title="Total Amount Sent"
        amount={`$${formatThousandNumber(totalAmount ?? 0)}`}
        percentage={100}
      />
      <TransactionCard
        type="distributions"
        title="Total Distribution Made"
        amount={formatThousandNumber(totalDistributions ?? 0)}
        percentage={100}
      />
      <TransactionCard
        type="addresses"
        title="Total Address Funded"
        amount={formatThousandNumber(totalFundedAddresses ?? 0)}
        percentage={100}
      />
    </div>
  );
};

export default TransactionCards;
