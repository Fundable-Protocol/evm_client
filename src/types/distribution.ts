import {
  distributionState,
  distributionStatus,
  distributionType,
  equalDistributionType,
  supportedNetwork,
} from "@/lib/constant";
import { Dispatch, SetStateAction } from "react";
import { AppSelectProps } from ".";

export type DistributionType = (typeof distributionType)[number];

export interface IDistributionInfo {
  amount?: number;
  selectedToken: string;
  type: DistributionType;
  showLabel?: boolean;
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

export type DistributionRowField = "address" | "amount" | "label";

export interface IDistributionRow {
  row: IDistributionData;
  isEqualDistribution: boolean;
  addLabel: boolean;
  onChange: (id: string, value: string, field: DistributionRowField) => void;
  onDelete: (id: string) => void;
}

export interface DistributionSelectorProps {
  distributionType: IDistributionInfo;
  distributionData?: IDistributionData[];
  supportedTokens?: AppSelectProps["options"];
  setDistributionType: Dispatch<SetStateAction<IDistributionInfo>>;
  setDistributionData?: Dispatch<SetStateAction<IDistributionData[]>>;
}

export type distributionTypeKey = keyof IDistributionInfo;

export interface DistributionDataProps {
  isConnected?: boolean;
  handleDistribution?: () => void;
  distributionType?: IDistributionInfo;
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
  totalAmount?: bigint;
  recipientCount: number;
  displayableAmount?: string;
  protocolFee?: bigint;
  protocolFeePercentage: number;
  distributionAmountsBigInt?: bigint[];
  currentState: (typeof distributionState)[number];
}

export interface DistributionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  distributionState: IDistributionState & { selectedToken: string };
}

export interface RecipientData {
  address: string;
  amount: string;
  label?: string;
}

export interface DistributionAttributes {
  id: string;
  user_address: string;
  token_address: string;
  token_symbol: string;
  token_decimals: number;
  total_amount: string;
  fee_amount: string;
  transaction_hash?: string | null;
  total_recipients: number;
  status: (typeof distributionStatus)[number];
  distribution_type: (typeof distributionType)[number];
  block_number?: bigint | number | null;
  block_timestamp?: Date | null;
  network: (typeof supportedNetwork)[number];
  created_at: Date | string;
  metadata?: { recipients: Array<RecipientData> } | null;
  recipients?: Array<RecipientData>;
}

export interface DistributionResponseAttributes {
  distributions: DistributionAttributes[];
  total: number;
}

export interface UpdateDistributionInput {
  transaction_hash?: DistributionAttributes["transaction_hash"];
  block_number?: DistributionAttributes["block_number"];
  block_timestamp?: DistributionAttributes["block_timestamp"];
  status?: DistributionAttributes["status"];
}

export interface IValidateDistributionAmounts {
  distributionInfo: IDistributionInfo;
  distributionData: IDistributionData[];
}

export interface ICalculateLumpSumAmount {
  distributionType: IDistributionInfo;
  distributionData: IDistributionData[];
  setDistributionData: Dispatch<SetStateAction<IDistributionData[]>>;
}
