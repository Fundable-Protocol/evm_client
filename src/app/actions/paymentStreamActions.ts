"use server";

export async function recordStreamOnServer(data: {
  name: string;
  recipient: string;
  tokenSymbol: string;
  txHash: string;
  network: string;
}) {
  // no-op for now (client localStorage is used). 
  return { ok: true };
}

