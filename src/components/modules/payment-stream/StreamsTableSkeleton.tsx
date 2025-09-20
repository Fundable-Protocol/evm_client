import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StreamsTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <Table className="bg-transparent">
        <TableHeader>
          <TableRow className="bg-fundable-violet border-none">
            {Array.from({ length: 7 }).map((_, i) => (
              <TableHead
                key={`streams-table-skeleton-head-${i}`}
                className="text-white font-bold p-4"
              >
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 7 }).map((_, row) => (
            <TableRow
              key={row}
              className="border-b border-gray-700/50 py-3 px-4"
            >
              {Array.from({ length: 7 }).map((_, cell) => (
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

export default StreamsTableSkeleton;
