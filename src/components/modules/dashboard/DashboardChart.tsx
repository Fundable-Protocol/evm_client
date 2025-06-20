"use client";

import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@starknet-react/core";
import { ITransactionDataPoint } from "@/types/dashboard";
import { getChartDataAction } from "@/app/actions/distributionActions";
import DashboardChartSkeleton from "./DashboardChartSkeleton";

// Define chart configuration for the 3 cryptocurrencies
const chartConfig = {
  STRK: {
    label: "STRK",
    color: "#FB49C0", // Bright pink for STRK
  },
  USDT: {
    label: "USDT",
    color: "#31AFD6", // USDT green
  },
  USDC: {
    label: "USDC",
    color: "#2775CA", // USDC blue
  },
} satisfies ChartConfig;

function DashboardChart() {
  const { address } = useAccount();

  const { data: transactionData = [], isFetching } = useQuery<
    ITransactionDataPoint[]
  >({
    queryKey: ["transactionChartData", address],
    queryFn: () => getChartDataAction(address!),
    enabled: !!address,
    refetchOnWindowFocus: true,
  });

  if (isFetching) return <DashboardChartSkeleton />;

  // Calculate min and max values for Y axis
  const allValues = transactionData.flatMap((point: ITransactionDataPoint) => [
    point.USDT,
    point.STRK,
    point.USDC,
    // point.ETH,
  ]);

  const minValue = Math.min(...allValues, transactionData[0]?.STRK ?? 0);
  const maxValue = Math.max(
    ...allValues,
    transactionData[transactionData.length - 1]?.STRK ?? 1000
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[24rem] w-full bg-fundable-mid-grey/30 rounded-md pt-2 pr-4"
    >
      <LineChart
        accessibilityLayer
        data={transactionData}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <XAxis dataKey="time" />
        <YAxis domain={[minValue, maxValue]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent />}
          align="left"
          verticalAlign="top"
          className="text-white mb-2 justify-start ml-6"
        />

        <Line
          type="monotone"
          dataKey="STRK"
          stroke={chartConfig.STRK.color}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />

        <Line
          type="monotone"
          dataKey="USDT"
          stroke={chartConfig.USDT.color}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />

        <Line
          type="monotone"
          dataKey="USDC"
          stroke={chartConfig.USDC.color}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default DashboardChart;
