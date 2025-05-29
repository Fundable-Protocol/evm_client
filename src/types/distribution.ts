import { distributionType, equalDistributionType } from "@/lib/constant";
import { Dispatch, SetStateAction } from "react";
import { AppSelectProps } from ".";

export type DistributionType = (typeof distributionType)[number];

export interface IDistributionType {
  selectedToken: string;
  amount?: number;
  type: DistributionType;
  equalAmountType?: (typeof equalDistributionType)[number]["value"];
}

export interface IDistributionRowData {
  id: string;
  address: string;
  amount: string;
}

export interface IDistribution {
  rows: IDistributionRowData[];
  totalAmount: string;
  distributionType: DistributionType;
}

export type DistributionRowField = "address" | "amount";

export interface IDistributionRow {
  row: IDistributionRowData;
  onChange: (id: string, value: string, field: DistributionRowField) => void;
  onDelete: (id: string) => void;
}

export interface DistributionSelectorProps {
  distributionType: IDistributionType;
  supportedTokens?: AppSelectProps["options"];
  setDistributionType: Dispatch<SetStateAction<IDistributionType>>;
}

export type distributionTypeKey = keyof IDistributionType;
