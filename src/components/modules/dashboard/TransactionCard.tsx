import { cn } from "@/lib/utils";

import PlusIcon from "@/components/svgs/PlusIcon";
import UserIcon from "@/components/svgs/UserIcon";
import ViewIcon from "@/components/svgs/ViewIcon";

import { TransactionCardProps } from "@/types/dashboard";

import PercentageDecreaseIcon from "@/components/svgs/PercentageDecreaseIcon";
import PercentageIncreaseIcon from "@/components/svgs/PercentageIncreaseIcon";

const TransactionCard = ({
  type,
  title,
  amount,
  percentage,
  isWalletConnected,
}: TransactionCardProps) => {
  const Icon =
    type === "amount" ? (
      <ViewIcon />
    ) : type === "distributions" ? (
      <UserIcon />
    ) : (
      <PlusIcon />
    );

  const isPercentageIncreased = percentage && percentage > 0;
  const isPercentageDecreased = percentage && percentage < 0;

  return (
    <div className="py-10 px-7 bg-fundable-mid-dark rounded-lg flex flex-col gap-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {isWalletConnected ? (
            <>
              {Icon}
              <span className="text-[#AEB9E1]">{title}</span>
            </>
          ) : (
            <p className="text-white font-geist-sans text-xl font-bold">
              Connect your wallet
            </p>
          )}
        </div>

        <div className="flex items-center gap-x-1">
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
          <span className="bg-[#AEB9E1] size-1 rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        <span className="text-3xl font-bold text-white font-geist-sans">
          {amount}
        </span>
        {isWalletConnected ? (
          <div
            className={cn({
              "flex items-center gap-x-1 text-xs py-1 px-1.5 rounded border":
                true,
              "bg-[#05c1692c] border-[#05c16945] text-[#05C168]":
                isPercentageIncreased,
              "bg-[#ff5a6530] border-[#ff5a6530] text-[#FF5A65]":
                isPercentageDecreased,
            })}
          >
            <span className="">{percentage}%</span>
            {isPercentageIncreased ? <PercentageIncreaseIcon /> : null}
            {isPercentageDecreased ? <PercentageDecreaseIcon /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TransactionCard;
