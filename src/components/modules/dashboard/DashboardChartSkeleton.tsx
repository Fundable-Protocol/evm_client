import { Skeleton } from "@/components/ui/skeleton";

function DashboardChartSkeleton() {
  return (
    <div className="min-h-[15rem] md:min-h-[24rem] w-full bg-fundable-mid-grey/30 rounded-md pt-4 pb-4 pr-4 flex flex-col justify-between relative overflow-hidden">
      {/* Legend Skeleton */}
      <div className="flex gap-6 mb-6 ml-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Area Skeleton */}
      <div className="relative flex-1 w-full flex items-end px-6 pb-0">
        {/* Horizontal grid lines */}
        {[10, 32, 54, 75.5, 97.5].map((percent, i) => (
          <Skeleton
            key={i}
            className="absolute left-15.5 right-7 h-[1px] rounded-full"
            style={{ bottom: `${percent}%` }}
          />
        ))}

        {/* X-axis label placeholders */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-10 h-4 rounded" />
          ))}
        </div>

        {/* Y-axis label placeholders */}
        <div className="ml-4 absolute left-2 top-0 bottom-6 flex flex-col justify-between">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-10 h-4 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardChartSkeleton;
