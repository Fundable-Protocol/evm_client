"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import DistributionRow from "./DistributionRow";
import {
  DistributionRowField,
  IDistributionRowData,
} from "@/types/distribution";

import { createEmptyRow } from "@/lib/utils";

const DistributionTable = () => {
  // Initialize rows with 3 empty rows
  const defaultEmptyRow = () => Array.from({ length: 3 }, createEmptyRow);

  const [rows, setRows] = useState<IDistributionRowData[]>(defaultEmptyRow);

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const updateRow = (
    id: string,
    value: string,
    field: DistributionRowField
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="flex flex-col items-end grow">
      <div className="flex gap-x-1.5">
        <Button variant="grey" className="font-bold" onClick={addRow}>
          Add Row
        </Button>
        <Button variant="gradient" className="font-bold">
          Distribute Token
        </Button>
      </div>

      <div className="w-full flex flex-col gap-y-3 p-2 mt-6">
        {rows.map((row) => (
          <DistributionRow
            key={row.id}
            row={row}
            onChange={updateRow}
            onDelete={deleteRow}
          />
        ))}
      </div>
    </div>
  );
};

export default DistributionTable;
