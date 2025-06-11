"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";

import { columns } from "@/components/modules/history/Columns";
import HistoryTable from "@/components/modules/history/HistoryTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getDistributionsAction } from "@/app/actions/distributionActions";
import HistoryTableSkeleton from "@/components/modules/history/HistoryTableSkeleton";
import { DistributionAttributes } from "@/types/distribution";
import {
  distributionFilterType,
  distributionFilterValueType,
} from "@/types/history";

const HistoryPage = () => {
  const { address } = useAccount();
  const [distributionFilter, setDistributionFilter] = useState<{
    status: DistributionAttributes["status"] | "all";
    type: DistributionAttributes["distribution_type"] | "all";
  }>({ status: "all", type: "all" });

  const { data: distributionsData, isPending } = useQuery({
    queryKey: ["distributions-table", distributionFilter],
    queryFn: () =>
      getDistributionsAction({
        user_address: address ?? "",
        page: 1,
        limit: 10,
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
      className="flex flex-col gap-y-6 overflow-y-hidden"
    >
      <div className="h-dvh">
        {address && isPending ? (
          <HistoryTableSkeleton />
        ) : (
          <HistoryTable
            columns={columns}
            data={distributionsData?.data ?? []}
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
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
