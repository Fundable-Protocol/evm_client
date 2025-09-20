import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HistoryTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8 w-full lg:w-1/3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            className="flex flex-col gap-y-4"
            key={`history-table-skeleton-${i}`}
          >
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>

      <Table className="bg-transparent">
        <TableHeader className="">
          <TableRow className="bg-fundable-violet border-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <TableHead
                key={`table-skeleton-head-${i}`}
                className="text-white font-bold p-4"
              >
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, row) => (
            <TableRow
              key={row}
              className="border-b border-gray-700/50 py-3 px-4"
            >
              {Array.from({ length: 8 }).map((_, cell) => (
                <TableCell key={cell} className="py-3 px-4">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryTableSkeleton;
