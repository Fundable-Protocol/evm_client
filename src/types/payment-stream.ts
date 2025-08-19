import type { DurationUnit } from "@/lib/utills/stream";
import type { ErrorWithCode } from ".";

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