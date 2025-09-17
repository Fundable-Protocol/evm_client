import type { DurationUnit } from "@/lib/utils/stream";

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
  name: string;
  recipient: string;
  tokenSymbol: string;
  txHash: string;
  network: string;
  creator: string;
  isCancellable: boolean;
  isTransferable: boolean;
  amount: string;
  duration: number;
  chainName: string;
  streamId: string;
  createdAt: string;
}

export interface CreateStreamParams {
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
