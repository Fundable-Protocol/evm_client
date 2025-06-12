import { featureCardImgTypes, transactionCardTypes } from "@/lib/constant";

export interface TransactionCardProps {
  type: (typeof transactionCardTypes)[number];
  amount: string | number;
  percentage?: number;
  title: string;
}

export interface FeatureCardProps {
  title: string;
  linkText: string;
  description: string;
  link: string;
  imgType: (typeof featureCardImgTypes)[number];
}

// Cache interface for token prices
export interface PriceCache {
  prices: Record<string, number>;
  timestamp: number;
}

export interface ITransactionDataPoint {
  time: string;
  USDT: number;
  STRK: number;
  USDC: number;
  ETH?: number;
}
