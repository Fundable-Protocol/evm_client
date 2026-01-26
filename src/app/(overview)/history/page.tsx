"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import {
  distributionFilterType,
  distributionFilterValueType,
} from "@/types/history";
import { DistributionAttributes } from "@/types/distribution";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import HistoryTable from "@/components/modules/history/HistoryTable";
import HistoryTableSkeleton from "@/components/modules/history/HistoryTableSkeleton";

import { useSearchParams } from "next/navigation";
import { validPageLimits } from "@/lib/constant";
import DistributionApiService from "@/services/api/distributionService";

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
    chain: DistributionAttributes["chain_name"] | "all";
  }>({ status: "all", type: "all", chain: "all" });

  const { data: distributionsData, isPending } = useQuery({
    queryKey: ["distributions-table", distributionFilter, page, limit],
    queryFn: async () => {
      console.log("🔍 [History] Fetching distributions with params:", {
        address,
        page,
        limit,
        status: distributionFilter.status !== "all" ? distributionFilter.status : undefined,
        type: distributionFilter.type !== "all" ? distributionFilter.type : undefined,
        chain: distributionFilter.chain !== "all" ? distributionFilter.chain : undefined,
      });
      
      const result = await DistributionApiService.getDistributions(address ?? "", {
        page,
        limit,
        status:
          distributionFilter.status !== "all"
            ? distributionFilter.status
            : undefined,
        type:
          distributionFilter.type !== "all"
            ? distributionFilter.type
            : undefined,
        chain:
          distributionFilter.chain !== "all"
            ? distributionFilter.chain
            : undefined,
      });
      
      return result;
    },

    enabled: !!address,
  });

  const handleDistributionFilter = (
    filter: distributionFilterType,
    value: distributionFilterValueType
  ) => {
    setDistributionFilter((prev) => ({
      ...prev,
      [filter]: value === "all" ? "all" : (filter === "chain" ? value : value?.toUpperCase()),
    }));
  };

  return (
    <DashboardLayout title="Transaction History">
      <div className="h-full overflow-y-auto">
        {address && isPending ? (
          <HistoryTableSkeleton />
        ) : (
          <HistoryTable
            data={distributionsData?.data?.distributions ?? []}
            statusFilter={distributionFilter.status}
            typeFilter={distributionFilter.type}
            chainFilter={distributionFilter.chain}
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
            onChainFilterChange={(value) =>
              handleDistributionFilter(
                "chain",
                value as typeof distributionFilter.chain
              )
            }
            totalCount={distributionsData?.data?.meta?.totalRows ?? 0}
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
