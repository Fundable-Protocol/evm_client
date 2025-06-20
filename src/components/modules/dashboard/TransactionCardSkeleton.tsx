import { Skeleton } from "@/components/ui/skeleton";

const TransactionCardSkeleton = () => {
  return (
    <div className="py-10 px-7 bg-fundable-mid-dark rounded-lg flex flex-col gap-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Skeleton className="size-6" />
          <Skeleton className="w-48 h-6" />
        </div>

        <div className="flex items-center gap-x-1">
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="size-1 rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        <Skeleton className="size-10" />
        <Skeleton className="w-30 h-10" />
      </div>
    </div>
  );
};

export default TransactionCardSkeleton;
