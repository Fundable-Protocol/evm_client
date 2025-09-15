"use client";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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

import { Stream } from "@/types/payment-stream";
import AppSelect from "@/components/molecules/AppSelect";
import { capitalizeWord } from "@/lib/utills";
import { streamColumns } from "./streamColumns";

interface StreamsTableProps {
  data: Stream[];
  page?: number;
  limit?: number;
  totalCount?: number;
  onStatusFilterChange?: (status: string) => void;
  statusFilter?: string;
}

function StreamsTable({
  data,
  page = 1,
  limit = 10,
  totalCount = 0,
  onStatusFilterChange,
  statusFilter = "all",
}: StreamsTableProps) {
  const pageCount = Math.ceil(totalCount / limit);

  const table = useReactTable({
    data,
    columns: streamColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,
    pageCount,
  });

  const statusOptions = ["all", "active", "paused", "completed"].map((status) => ({
    label: capitalizeWord(status),
    value: status,
  }));

  const handleStatusChange = (value: string) => {
    onStatusFilterChange?.(value);
  };

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto pb-4">
      <div className="grid grid-cols-1 px-1 gap-x-8 w-full lg:w-1/3">
        <AppSelect
          title="Filter by Status"
          placeholder={statusOptions.find(opt => opt.value === statusFilter)?.label || statusOptions[0].label}
          options={statusOptions}
          setValue={handleStatusChange}
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
        <TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-x [&_tr:last-child]:border-gray-700/50">
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
              <TableCell colSpan={streamColumns.length} className="h-24 text-center">
                No streams found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalCount > 0 && (
        <Pagination>
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
                key={`streams-pagination-${index}`}
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
      )}
    </div>
  );
}

export default StreamsTable;
