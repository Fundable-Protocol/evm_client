"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DistributionAttributes } from "@/types/distribution";
import { getStatusColor } from "@/lib/utils";
import ActionsCell from "./ActionsCell";
import { format } from "date-fns";

// Mobile-optimized columns - showing only essential information
export const mobileColumns: ColumnDef<DistributionAttributes>[] = [
  {
    accessorKey: "sn",
    header: "S/N",
    size: 60,
  },
  {
    accessorKey: "total_recipients",
    header: "Recipients",
    size: 80,
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
    size: 100,
  },
  {
    accessorKey: "token_symbol",
    header: "Token",
    size: 80,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const distribution = row.original;

      return (
        <div className="flex items-center">
          <span
            className={`size-2 rounded-full ${getStatusColor(
              distribution.status.toUpperCase()
            )} mr-2`}
          />
          <span className="text-white capitalize text-sm">{distribution.status}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    size: 80,
    cell: ({ row }) => <ActionsCell distribution={row.original} />,
  },
];

// Desktop columns with all information
export const desktopColumns: ColumnDef<DistributionAttributes>[] = [
  {
    accessorKey: "sn",
    header: "S/N",
  },
  {
    accessorKey: "total_recipients",
    header: "Recipients",
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
  },
  {
    accessorKey: "token_symbol",
    header: "Token",
  },
  {
    accessorKey: "distribution_type",
    header: "Type",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const distribution = row.original;
      return (
        <div className="text-white">
          {format(new Date(distribution.created_at), "MMM dd, yyyy hh:mm a")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const distribution = row.original;

      return (
        <div className="flex items-center">
          <span
            className={`size-2 rounded-full ${getStatusColor(
              distribution.status.toUpperCase()
            )} mr-2`}
          />
          <span className="text-white capitalize">{distribution.status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "chain_name",
    header: "Network",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell distribution={row.original} />,
  },
];
