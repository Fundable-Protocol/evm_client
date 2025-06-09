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
