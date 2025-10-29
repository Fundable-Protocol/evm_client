import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const DashboardLayout = ({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <main className="flex flex-col bg-fundable-mid-dark text-white text-base p-4 md:pt-6 md:pb-0 rounded-2xl h-full overflow-y-auto">
      <h1 className="font-syne font-medium border-b border-b-gray-700 pb-4 w-full">
        {title}
      </h1>
      <main
        className={cn("flex-1 my-4 h-full overflow-y-auto px-2", className)}
      >
        {children ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-syne font-medium mb-2">Coming Soon</h2>
            <p className="text-gray-400 text-center">
              This feature is currently under development. Please check back
              later!
            </p>
          </div>
        )}
      </main>
    </main>
  );
};

export default DashboardLayout;