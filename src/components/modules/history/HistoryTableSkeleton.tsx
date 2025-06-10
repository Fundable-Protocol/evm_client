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
        {Array.from({ length: 20 }).map((_, row) => (
          <TableRow key={row} className="border-b border-gray-700">
            {Array.from({ length: 8 }).map((_, cell) => (
              <TableCell key={cell} className="py-3 px-4">
                <Skeleton className="h-4 w-24" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HistoryTableSkeleton;
