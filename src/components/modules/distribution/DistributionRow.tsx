import { FC } from "react";
import { Trash2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { IDistributionRow } from "@/types/distribution";

const DistributionRow: FC<IDistributionRow> = ({ onChange, onDelete, row }) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-x-3">
      <Input
        className="border-none bg-fundable-mid-grey h-12 md:h-14 rounded"
        placeholder="Address"
        name="address"
        value={row.address}
        onChange={(e) => onChange(row.id, e.target.value, "address")}
      />

      <div className="flex items-center w-full mt-3 md:mt-0 pb-3 md:pb-0 md:w-1/2 gap-x-3">
        <Input
          className="border-none bg-fundable-mid-grey rounded h-12 md:h-14"
          name="amount"
          placeholder="Amount"
          value={row.amount}
          onChange={(e) => onChange(row.id, e.target.value, "amount")}
        />

        <span className="grid place-content-center bg-fundable-mid-grey h-12 md:h-14 px-3 rounded">
          <Trash2Icon
            className="text-gray-300 hover:text-destructive cursor-pointer"
            onClick={() => onDelete(row.id)}
          />
        </span>
      </div>
    </div>
  );
};

export default DistributionRow;
