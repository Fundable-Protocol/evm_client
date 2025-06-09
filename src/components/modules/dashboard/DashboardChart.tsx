"use client";

import React, { useEffect, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
// import { getTransactionData } from "@/app/actions/getTransactionData";

type TransactionDataPoint = {
  time: string;
  USDT: number;
  STRK: number;
  USDC: number;
};

// Define chart configuration for the 3 cryptocurrencies
const chartConfig = {
  USDT: {
    label: "USDT",
    color: "#31AFD6", // USDT green
  },
  STRK: {
    label: "STRK",
    color: "#FB49C0", // Bright pink for STRK
  },
  USDC: {
    label: "USDC",
    color: "#2775CA", // USDC blue
  },
} satisfies ChartConfig;

function DashboardChart() {
  const [transactionData, setTransactionData] = useState<
    TransactionDataPoint[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactionData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTransactionData();
        setTransactionData(data);
      } catch (err) {
        setError("Failed to load transaction data");
        console.error("Error loading transaction data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTransactionData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-h-[24rem] w-full bg-fundable-mid-grey/30 rounded-md pt-2 flex items-center justify-center text-white">
        Loading transaction data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-h-[24rem] w-full bg-fundable-mid-grey/30 rounded-md pt-2 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[24rem] w-full bg-fundable-mid-grey/30 rounded-md pt-2"
    >
      <LineChart
        accessibilityLayer
        data={transactionData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <XAxis dataKey="time" />
        <YAxis domain={[2000, 6000]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent />}
          align="left"
          verticalAlign="top"
          className="text-white mb-2 justify-start ml-6"
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
          dataKey="STRK"
          stroke={chartConfig.STRK.color}
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
