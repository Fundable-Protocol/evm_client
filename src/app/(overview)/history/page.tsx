"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@starknet-react/core";

import {
  distributionFilterType,
  distributionFilterValueType,
} from "@/types/history";
import { DistributionAttributes } from "@/types/distribution";
import { columns } from "@/components/modules/history/columns";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import HistoryTable from "@/components/modules/history/HistoryTable";
import { getDistributionsAction } from "@/app/actions/distributionActions";
import HistoryTableSkeleton from "@/components/modules/history/HistoryTableSkeleton";

import { useSearchParams } from "next/navigation";
import { validPageLimits } from "@/lib/constant";

const HistoryPageContent = () => {
  const { address } = useAccount();

  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = validPageLimits.includes(
    parseInt(
      searchParams.get("limit") || "10"
    ) as (typeof validPageLimits)[number]
  )
    ? parseInt(searchParams.get("limit") || "10")
    : validPageLimits[0];

  const [distributionFilter, setDistributionFilter] = useState<{
    status: DistributionAttributes["status"] | "all";
    type: DistributionAttributes["distribution_type"] | "all";
  }>({ status: "all", type: "all" });

  const { data: distributionsData, isPending } = useQuery({
    queryKey: ["distributions-table", distributionFilter, page, limit],
    queryFn: () =>
      getDistributionsAction({
        user_address: address ?? "",
        page, // Convert to 1-based for API
        limit,
        status:
          distributionFilter.status !== "all"
            ? distributionFilter.status
            : undefined,
        type:
          distributionFilter.type !== "all"
            ? distributionFilter.type
            : undefined,
      }),

    enabled: !!address,
  });

  const handleDistributionFilter = (
    filter: distributionFilterType,
    value: distributionFilterValueType
  ) => {
    setDistributionFilter((prev) => ({ ...prev, [filter]: value }));
  };

  return (
    <DashboardLayout
      title="Transaction History"
      availableNetwork={["testnet", "mainnet"]}
    >
      <div className="h-full overflow-y-auto">
        {address && isPending ? (
          <HistoryTableSkeleton />
        ) : (
          <HistoryTable
            columns={columns}
            data={distributionsData?.data?.distributions ?? []}
            statusFilter={distributionFilter.status}
            typeFilter={distributionFilter.type}
            onStatusFilterChange={(value) =>
              handleDistributionFilter(
                "status",
                value as typeof distributionFilter.status
              )
            }
            onTypeFilterChange={(value) =>
              handleDistributionFilter(
                "type",
                value as typeof distributionFilter.type
              )
            }
            totalCount={distributionsData?.data?.total ?? 0}
            page={page}
            limit={limit}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const HistoryPage = () => {
  return (
    <Suspense fallback={<HistoryTableSkeleton />}>
      <HistoryPageContent />
    </Suspense>
  );
};

export default HistoryPage;
