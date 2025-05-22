import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const DashboardLayout = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <main className="flex flex-col bg-fundable-mid-dark text-white text-base p-4 md:p-6 rounded-2xl">
      <h1 className="font-syne font-medium border-b border-b-gray-700 pb-4 w-full">
        {title}
      </h1>
      <main className={cn("flex-1 my-4", className)}>{children}</main>
    </main>
  );
};

export default DashboardLayout;
