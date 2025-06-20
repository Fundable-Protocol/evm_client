import { z } from "zod";

import {
  distributionStatus,
  distributionType,
  supportedNetwork,
} from "@/lib/constant";

export const recipientDataSchema = z.object({
  address: z.string(),
  amount: z.string(),
});

export const distributionQuerySchema = z
  .object({
    limit: z.string().transform(Number),
    status: z.enum(distributionStatus),
    page: z.string().transform(Number),
    user_address: z.string(),
  })
  .partial();

export const createDistributionSchema = z.object({
  user_address: z.string(),
  token_address: z.string(),
  token_symbol: z.string(),
  token_decimals: z.number(),
  total_amount: z.string(),
  fee_amount: z.string(),
  usd_rate: z.string(),
  total_usd_amount: z.string(),
  chain_name: z.string(),
  transaction_hash: z.string().optional(),
  total_recipients: z.number(),
  status: z.enum(distributionStatus).transform((val) => val?.toUpperCase()),
  distribution_type: z
    .enum(distributionType)
    .transform((val) => val?.toUpperCase()),
  block_number: z.number().optional(),
  block_timestamp: z.date().optional(),
  network: z.enum(supportedNetwork).transform((val) => val?.toUpperCase()),
  metadata: z
    .object({
      recipients: z.array(recipientDataSchema),
    })
    .nullable()
    .optional(),
});

export const updateDistributionSchema = z
  .object({
    block_timestamp: z.date(),
    transaction_hash: z.string(),
    block_number: z.union([z.number(), z.bigint()]),
    status: z.enum(distributionStatus).transform((val) => val?.toUpperCase()),
  })
  .partial();
