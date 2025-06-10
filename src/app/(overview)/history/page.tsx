"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@starknet-react/core";

import { IHistoryData } from "@/types/history";
import { columns } from "@/components/modules/history/columns";
import DataTable from "@/components/modules/history/data-table";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getDistributionsAction } from "@/app/actions/distributionActions";
import HistoryTableSkeleton from "@/components/modules/history/HistoryTableSkeleton";

export const data: IHistoryData[] = [
  {
    id: "m5gr84i9",
    recipients: "0x1234...5678",
    amount: 316,
    type: "STRK",
    date: "2024-03-20",
    status: "success",
    network: "Ethereum",
  },
  {
    id: "3u1reuv4",
    recipients: "0x8765...4321",
    amount: 242,
    type: "USDC",
    date: "2024-03-19",
    status: "success",
    network: "Polygon",
  },
  {
    id: "derv1ws0",
    recipients: "0x9876...1234",
    amount: 837,
    type: "USDT",
    date: "2024-03-18",
    status: "pending",
    network: "BSC",
  },
  {
    id: "5kma53ae",
    recipients: "0x5678...9012",
    amount: 874,
    type: "ETH",
    date: "2024-03-17",
    status: "success",
    network: "Arbitrum",
  },
  {
    id: "bhqecj4p",
    recipients: "0x3456...7890",
    amount: 721,
    type: "STRK",
    date: "2024-03-16",
    status: "failed",
    network: "Ethereum",
  },
];

const HistoryPage = () => {
  const { address } = useAccount();

  const { data: distributionsData, isPending } = useQuery({
    queryKey: ["distributions"],
    queryFn: () =>
      getDistributionsAction({
        user_address: address ?? "",
        page: 1,
        limit: 10,
      }),
    enabled: !!address,
  });

  return (
    <DashboardLayout
      title="Transaction History"
      className="flex flex-col gap-y-6 overflow-y-hidden"
    >
      <div className="h-dvh">
        {isPending ? (
          <HistoryTableSkeleton />
        ) : (
          <DataTable columns={columns} data={distributionsData?.data ?? []} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
