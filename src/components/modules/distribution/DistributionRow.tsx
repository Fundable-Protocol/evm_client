import { FC } from "react";
import { Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utills";
import { Input } from "@/components/ui/input";
import { IDistributionRow } from "@/types/distribution";

const DistributionRow: FC<IDistributionRow> = ({
  onChange,
  onDelete,
  row,
  isEqualDistribution,
  addLabel,
  equalAmount,
}) => {
  const isEqualStyle = cn("flex items-center w-full pb-3 md:pb-0 gap-x-3", {
    "md:w-1/2": !isEqualDistribution,
    "md:max-w-max": isEqualDistribution,
  });

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-3">
      {addLabel ? (
        <Input
          className="border-none bg-fundable-mid-grey rounded h-12 md:h-14 md:w-1/4"
          name="label"
          placeholder="Label/Name"
          value={row.label}
          onChange={(e) => onChange(row.id, e.target.value, "label")}
        />
      ) : null}
      <Input
        className="border-none h-12 md:h-14 rounded"
        placeholder="Address"
        name="address"
        value={row.address}
        onChange={(e) => onChange(row.id, e.target.value, "address")}
      />

      <div className={isEqualStyle}>
        <Input
          className="border-none rounded h-12 md:h-14"
          name="amount"
          placeholder="Amount"
          value={isEqualDistribution ? equalAmount?.toString() || "0" : row.amount}
          onChange={(e) => onChange(row.id, e.target.value, "amount")}
          disabled={isEqualDistribution}
        />

        <button
          type="button"
          className="group grid place-content-center bg-fundable-mid-grey h-12 md:h-14 px-4 rounded hover:bg-fundable-mid-grey/80 focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[2px] transition-colors cursor-pointer"
          onClick={() => onDelete(row.id)}
          aria-label="Delete distribution row"
        >
          <Trash2Icon className="text-gray-300 group-hover:text-destructive transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default DistributionRow;
