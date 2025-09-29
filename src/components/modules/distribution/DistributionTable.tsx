"use client";

import { Button } from "@/components/ui/button";
import DistributionRow from "./DistributionRow";
import {
  DistributionDataProps,
  DistributionRowField,
} from "@/types/distribution";

import { createEmptyRow } from "@/lib/utils";

const DistributionTable = ({
  isConnected,
  distributionType,
  distributionData,
  handleDistribution,
  setDistributionData,
}: DistributionDataProps) => {
  // Initialize rows with 3 empty rows

  const addRow = () => {
    setDistributionData((prev) => [...prev, createEmptyRow()]);
  };

  const deleteRow = (id: string) => {
    setDistributionData((prev) => prev.filter((row) => row.id !== id));
  };

  const updateRow = (
    id: string,
    value: string,
    field: DistributionRowField
  ) => {
    setDistributionData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const isNotEqualPerAddressDistribution =
    distributionType?.type === "equal" &&
    distributionType?.equalAmountType !== "lump_sum";

  return (
    <div className="flex flex-col items-end grow">
      <div className="flex gap-x-1.5">
        <Button variant="grey" className="font-bold" onClick={addRow}>
          Add Row
        </Button>
        <Button
          variant="gradient"
          className="font-bold"
          disabled={isConnected}
          onClick={handleDistribution}
        >
          Distribute Token
        </Button>
      </div>

      <div className="w-full flex flex-col gap-y-3 p-2 mt-6">
        {distributionData?.map((row, i) => (
          <DistributionRow
            row={row}
            onChange={updateRow}
            onDelete={deleteRow}
            key={`distribution-row-${i}`}
            addLabel={distributionType?.showLabel || false}
            isEqualDistribution={isNotEqualPerAddressDistribution}
            equalAmount={distributionType?.amount}
          />
        ))}
      </div>
    </div>
  );
};

export default DistributionTable;
