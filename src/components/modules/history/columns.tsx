"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DistributionAttributes } from "@/types/distribution";
import { getStatusColor } from "@/lib/utils";
import ActionsCell from "./ActionsCell";
import { format } from "date-fns";

export const columns: ColumnDef<DistributionAttributes>[] = [
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
