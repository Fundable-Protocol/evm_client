import {
  distributionState,
  distributionType,
  equalDistributionType,
} from "@/lib/constant";
import { Dispatch, SetStateAction } from "react";
import { AppSelectProps } from ".";

export type DistributionType = (typeof distributionType)[number];

export interface IDistributionType {
  selectedToken: string;
  amount?: number;
  type: DistributionType;
  equalAmountType?: (typeof equalDistributionType)[number]["value"];
}

export interface IDistributionData {
  id: string;
  amount: string;
  label?: string;
  address?: string;
  starkAddress?: string;
}

export interface IDistribution {
  totalAmount: string;
  rows: IDistributionData[];
  distributionType: DistributionType;
}

export type DistributionRowField = "address" | "amount";

export interface IDistributionRow {
  row: IDistributionData;
  onChange: (id: string, value: string, field: DistributionRowField) => void;
  onDelete: (id: string) => void;
}

export interface DistributionSelectorProps {
  distributionType: IDistributionType;
  supportedTokens?: AppSelectProps["options"];
  setDistributionType: Dispatch<SetStateAction<IDistributionType>>;
}

export type distributionTypeKey = keyof IDistributionType;

export interface DistributionDataProps {
  handleDistribution?: () => void;
  distributionData?: IDistributionData[];
  setDistributionData: Dispatch<SetStateAction<IDistributionData[]>>;
}

export interface UseStarkNameResolverProps {
  distributions: IDistributionData[];
  setDistributions: (
    distributions: Array<{ address: string; amount: string }>
  ) => void;
}

export type starkNameResolverState = Record<
  number,
  { resolving: boolean; starkName: string }
>;

export interface IDistributionState {
  totalAmount: string;
  recipientCount: number;
  protocolFeePercentage: number;
  currentState: (typeof distributionState)[number];
}

export interface DistributionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  distributionState: IDistributionState & { selectedToken: string };
}
