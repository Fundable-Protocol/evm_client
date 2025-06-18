import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utills";
import { Button } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    role="pavigation"
    aria-label="pagination"
    className={cn("flex justify-between items-center", className)}
    {...props}
  />
);

const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));

PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("", className)} {...props} />
));

PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<typeof Button>;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant="ghost"
    size={size}
    className={cn(
      "s-8 p-0 hover:text-white",
      isActive &&
        "bg-fundable-deep-purple text-white hover:bg-fundable-deep-purple/90",
      !isActive &&
        "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white",
      className
    )}
    {...props}
  />
);

PaginationLink.displayName = "PaginationLink";

const PaginationNav = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant="ghost"
    size={size}
    className={cn(
      isActive &&
        "bg-fundable-deep-purple text-white hover:bg-fundable-deep-purple/90",
      !isActive &&
        "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white",
      className
    )}
    {...props}
  />
);

PaginationNav.displayName = "PaginationNav";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationNav
    aria-label="Go to previous page"
    size="default"
    className={cn("flex", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationNav>
);

PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationNav
    aria-label="Go to next page"
    size="default"
    className={cn(
      "gap-1 pr-2.5 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white",
      className
    )}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationNav>
);

PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex h-9 w-9 items-center justify-center text-gray-400",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
