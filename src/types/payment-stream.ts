// TODO: Add types for payment stream

/*

    name: "",
    recipient: "",
    token: tokenOptions[0].value,
    duration: durationOptions[0].value,
    durationValue: "",
    cancellability: false,
    transferability: false,

*/

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
  streamId?: string;
  createdAt: string;
}