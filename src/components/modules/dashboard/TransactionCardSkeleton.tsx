import { Skeleton } from "@/components/ui/skeleton";

const TransactionCardSkeleton = () => {
  return (
    <div className="py-10 px-7 bg-fundable-mid-dark rounded-lg flex flex-col gap-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Skeleton className="w-5 h-4" />
          <Skeleton className="w-32 h-4" />
        </div>

        <div className="flex items-center gap-x-1">
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        <Skeleton className="w-10 h-8" />
        <Skeleton className="w-40 h-8" />
      </div>
    </div>
  );
};

export default TransactionCardSkeleton;
