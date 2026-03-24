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
import { useAccount } from "wagmi";
import { ITransactionDataPoint } from "@/types/dashboard";
import DashboardChartSkeleton from "./DashboardChartSkeleton";
import DistributionApiService from "@/services/api/distributionService";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DashboardChart() {
  const { address } = useAccount();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(
    currentYear.toString()
  );

  // Generate years from 2025 to currentYear
  const years = Array.from(
    { length: currentYear - 2025 + 1 },
    (_, i) => (2025 + i).toString()
  );

  const { data: transactionData = [], isFetching } = useQuery<
    ITransactionDataPoint[]
  >({
    queryKey: ["transactionChartData", address, selectedYear],
    queryFn: async () => {
      const response = await DistributionApiService.getDistributionChartData(
        address!,
        parseInt(selectedYear)
      );

      return (response.data as unknown as ITransactionDataPoint[]) || [];
    },
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
    <div className="flex flex-col gap-y-4 w-full bg-fundable-mid-grey/30 rounded-md p-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-white font-medium">Distribution Activity</h3>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px] bg-fundable-mid-dark border-fundable-light-dark/30 text-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-fundable-mid-dark border-fundable-light-dark/30 text-white">
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ChartContainer config={chartConfig} className="max-h-[24rem] w-full pt-2">
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
    </div>
  );
}

export default DashboardChart;
