import { Skeleton } from "../ui/skeleton";

const NavbarLoader = () => {
  return (
    <nav className="py-5 px-3 md:px-5 flex justify-between items-center border-b border-b-fundable-mid-dark text-white">
      <span className="flex items-center gap-x-2">
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-30 h-8" />
      </span>
      <div className="flex items-center gap-x-4">
        <Skeleton className="size-8 rounded-full hidden md:block" />

        <Skeleton className="w-36 h-8" />
      </div>
    </nav>
  );
};

export default NavbarLoader;
