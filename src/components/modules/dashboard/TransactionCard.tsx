import PlusIcon from "@/components/svgs/PlusIcon";
import UserIcon from "@/components/svgs/UserIcon";
import ViewIcon from "@/components/svgs/ViewIcon";

import { TransactionCardProps } from "@/types/dashboard";

const TransactionCard = ({
  type,
  title,
  amount,
}: TransactionCardProps) => {
  const Icon =
    type === "amount" ? (
      <ViewIcon />
    ) : type === "distributions" ? (
      <UserIcon />
    ) : (
      <PlusIcon />
    );

  return (
    <div className="py-10 px-7 bg-fundable-mid-dark rounded-lg flex flex-col gap-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {Icon}
          <span className="text-[#AEB9E1]">{title}</span>
        </div>

        <div className="flex items-center gap-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        <span className="text-4xl font-bold text-white font-geist-sans tracking-tight leading-none">
          {amount}
        </span>
      </div>
    </div>
  );
};

export default TransactionCard;
