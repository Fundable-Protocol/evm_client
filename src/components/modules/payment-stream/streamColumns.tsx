"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Stream } from "@/types/payment-stream";
import Image from "next/image";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-500";
    case "paused":
      return "bg-orange-500";
    case "completed":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getTokenIcon = (token: string) => {
  switch (token) {
    case "XLM":
      return "stellar_xlm";
    case "TON":
      return "ton";
    case "STRK":
      return "starknet";
    default:
      return "starknet";
  }
};

export const streamColumns: ColumnDef<Stream>[] = [
  {
    accessorKey: "id",
    header: "Stream ID",
  },
  {
    accessorKey: "recipient",
    header: "Recipient Address",
    cell: ({ row }) => (
      <span className="text-white font-mono">
        {row.getValue("recipient")}
      </span>
    ),
  },
  {
    accessorKey: "amountPerSecond",
    header: "Amount Per Second",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "token",
    header: "Token",
    cell: ({ row }) => {
      const token = row.getValue("token") as string;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={`/svgs/${getTokenIcon(token)}.svg`}
            alt={token}
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-white">{token}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center">
          <span
            className={`size-2 rounded-full ${getStatusColor(status)} mr-2`}
          />
          <span className="text-white capitalize">{status}</span>
        </div>
      );
    },
  },
];
