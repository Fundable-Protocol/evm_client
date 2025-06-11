"use client";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import { DataTableProps } from "@/types/history";
import { useState } from "react";

import { DistributionAttributes } from "@/types/distribution";
import AppSelect from "@/components/molecules/AppSelect";
import { distributionStatus, distributionType } from "@/lib/constant";
import { capitalizeWord } from "@/lib/utills";

function HistoryTable<TData, TValue>({
  data,
  columns,
  onStatusFilterChange,
  onTypeFilterChange,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  const handleStatusChange = (value: string) => {
    onStatusFilterChange(value as DistributionAttributes["status"] | "all");
  };

  const handleTypeChange = (value: string) => {
    onTypeFilterChange(
      value as DistributionAttributes["distribution_type"] | "all"
    );
  };

  const statusOptions = ["all", ...distributionStatus].map((status) => ({
    label: capitalizeWord(status),
    value: status,
  }));

  const typeOptions = ["all", ...distributionType].map((type) => ({
    label: capitalizeWord(type),
    value: type,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8 w-full lg:w-1/3">
        <AppSelect
          title="Filter by Status"
          placeholder={statusOptions[0].label}
          options={statusOptions}
          setValue={handleStatusChange}
        />

        <AppSelect
          title="Filter by Type"
          placeholder={typeOptions[0].label}
          options={typeOptions}
          setValue={handleTypeChange}
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-fundable-deep-purple border-none"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-white font-bold p-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b border-x border-gray-700/50"
                data-hover="hover"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
