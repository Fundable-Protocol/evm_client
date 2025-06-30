"use client";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  Updater,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationNext,
  PaginationLink,
  PaginationContent,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { DataTableProps } from "@/types/history";
import { useState } from "react";

import { DistributionAttributes } from "@/types/distribution";
import AppSelect from "@/components/molecules/AppSelect";
import {
  distributionStatus,
  distributionType,
  validPageLimits,
} from "@/lib/constant";
import { capitalizeWord } from "@/lib/utills";

import { useRouter } from "next/navigation";

function HistoryTable<TData, TValue>({
  data,
  page,
  limit,
  columns,
  totalCount = 0,
  onTypeFilterChange,
  onStatusFilterChange,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const router = useRouter();
  const pageCount = Math.ceil(totalCount / limit);

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    const nextPage =
      typeof updater === "function"
        ? updater({ pageIndex: page - 1, pageSize: limit })
        : updater;
    const newPage = nextPage.pageIndex + 1;
    router.push(`?page=${newPage}&limit=${limit}`);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onPaginationChange: handlePaginationChange,
    manualPagination: true,
    pageCount,
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

  const pageSize = validPageLimits.map((limit) => ({
    label: `${limit} per page`,
    value: limit.toString(),
  }));

  const handlePageSizeChange = (value: string) => {
    table.setPageSize(parseInt(value));
    router.push(`?page=1&limit=${value}`);
  };

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto pb-4">
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

      {/* Pagination */}
      <Pagination>
        <PaginationContent className="hidden lg:flex items-center space-x-4">
          <p className="text-sm font-medium text-gray-300">Showing</p>
          <AppSelect
            options={pageSize}
            placeholder={
              limit
                ? pageSize.find((size) => size.value === String(limit))?.label
                : pageSize[0].label
            }
            setValue={handlePageSizeChange}
          />
        </PaginationContent>

        <PaginationContent className="hidden lg:flex flex-col sm:flex-row sm:space-y-0 sm:space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-300">
            Page {table.getState().pagination.pageIndex + 1} of {pageCount}
          </div>
        </PaginationContent>

        <PaginationContent className="gap-2">
          <PaginationPrevious
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
          {Array.from({ length: pageCount > 3 ? 3 : pageCount }, (_, index) => (
            <PaginationLink
              key={`history-distribution-pagination-${index}`}
              onClick={() => table.setPageIndex(index)}
              isActive={table.getState().pagination.pageIndex + 1 === index + 1}
            >
              {index + 1}
            </PaginationLink>
          ))}

          {pageCount > 3 ? (
            <PaginationContent className="flex items-center space-x-4">
              <PaginationEllipsis />
              <PaginationLink
                onClick={() => table.setPageIndex(pageCount - 1)}
                isActive={
                  table.getState().pagination.pageIndex + 1 === pageCount
                }
              >
                {pageCount}
              </PaginationLink>
            </PaginationContent>
          ) : null}

          <PaginationNext
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default HistoryTable;
