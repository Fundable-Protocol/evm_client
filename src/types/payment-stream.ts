import type { DurationUnit } from "@/lib/utils/stream";
import { Dispatch, SetStateAction } from "react";
import { AppSelectProps } from ".";

export interface StreamData {
  name: string;
  recipient: string;
  token: string;
  amount: string;
  duration: string;
  durationValue: string;
  cancellability: boolean;
  transferability: boolean;
}

export interface Stream {
  id: number;
  recipient: string;
  amountPerSecond: number;
  startDate: string;
  endDate: string;
  token: string;
  status: string;
}

export interface StreamRecord {
  sn?: number;
  id: string;
  creator: string;
  recipient: string;
  is_cancellable: boolean;
  is_transferable: boolean;
  amount: string;
  duration: number;
  status: string;
  chain_name: string;
  network: string;
  stream_id: string;
  transaction_hash: string;
  token_symbol: string;
  total_usd_amount: number;
  created_at: string | number;
  updated_at: string;
}

export interface CreateStreamParams {
  creator: string;
  name: string;
  recipient: string;
  tokenSymbol: string;
  totalAmount: string;
  durationValue: number;
  durationUnit: DurationUnit;
  cancellable: boolean;
  transferable: boolean;
}

export interface CreateStreamResult {
  transactionHash: string;
}

export type CreateStreamResponse = {
  success: boolean;
  data?: CreateStreamResult;
  message?: string;
};

export interface StreamsTableProps {
  data: StreamRecord[];
  page?: number;
  limit?: number;
  totalCount?: number;
}

// New confirmation modal props
export interface PaymentStreamConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  streamData: StreamData;
  isLoading?: boolean;
}

export interface StreamFormProps {
  streamData: StreamData;
  tokenOptions: AppSelectProps["options"];
  durationOptions: AppSelectProps["options"];
  setStreamData: Dispatch<SetStateAction<StreamData>>;
  onSubmit: () => void;
  isSubmitting?: boolean;
}
