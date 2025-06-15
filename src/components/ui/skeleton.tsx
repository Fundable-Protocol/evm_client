import { cn } from "@/lib/utills";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-fundable-grey animate-pulse rounded", className)}
      {...props}
    />
  );
}

export { Skeleton };
