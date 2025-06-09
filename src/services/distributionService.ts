import CurrencyJs from "currency.js";

import { z } from "zod";
import { DistributionAttributes } from "@/types/distribution";
import { and, count, desc, eq, ilike, sum } from "drizzle-orm";

import { db } from "../../db/drizzle";

import { distributionModel } from "../../db/schema";
import {
  createDistributionSchema,
  updateDistributionSchema,
} from "@/policies/distribution";
import { distributionStatus } from "@/lib/constant";
import { fetchTokenPrices } from "./apiServices";
import { tryCatch } from "@/lib/utils";

export class DistributionService {
  /**
   * Create a new distribution record
   */
  static async createDistribution(
    data: z.infer<typeof createDistributionSchema>
  ): Promise<DistributionAttributes> {
    const [newDistribution] = await db
      .insert(distributionModel)
      .values({
        ...data,
        status: data.status as DistributionAttributes["status"],
        distribution_type:
          data.distribution_type as DistributionAttributes["distribution_type"],
        network: data.network as DistributionAttributes["network"],
      })
      .returning();

    return newDistribution as DistributionAttributes;
  }

  /**
   * Update a distribution record with transaction details
   */
  static async updateDistribution(
    id: string,
    data: z.infer<typeof updateDistributionSchema>
  ): Promise<DistributionAttributes> {
    const [updatedData] = await db
      .update(distributionModel)
      .set({
        ...(data?.transaction_hash && {
          transaction_hash: data?.transaction_hash,
        }),
        ...(data.block_number !== undefined && {
          block_number: Number(data.block_number), // ← cast here
        }),
        ...(data?.block_timestamp && {
          block_timestamp: data?.block_timestamp,
        }),
        ...(data?.status && {
          status: data?.status as DistributionAttributes["status"],
        }),
      })
      .where(eq(distributionModel.id, id))
      .returning();

    return updatedData as DistributionAttributes;
  }

  /**
   * Get a distribution by ID
   */
  static async getDistributionById(
    id: string
  ): Promise<DistributionAttributes | null> {
    const [dist] = await db
      .select()
      .from(distributionModel)
      .where(eq(distributionModel.id, id))
      .limit(1); // Fetch single row

    return (dist as DistributionAttributes) ?? null;
  }

  /**
   * Get distributions by user address
   */
  static async getDistributionsByUser(
    user_address: string,
    page = 1,
    limit = 10,
    status?: DistributionAttributes["status"]
  ): Promise<{ distributions: DistributionAttributes[]; total: number }> {
    const skip = (page - 1) * limit;

    const andQuery = and(
      eq(distributionModel.user_address, user_address),
      status ? ilike(distributionModel.status, status) : undefined
    );

    const [distributions, total] = await Promise.all([
      db
        .select()
        .from(distributionModel)
        .where(andQuery)
        .orderBy(desc(distributionModel.created_at))
        .limit(limit)
        .offset(skip),
      db.select({ cnt: count() }).from(distributionModel).where(andQuery),
    ]);

    return {
      distributions: distributions as DistributionAttributes[],
      total: Number(total[0]?.cnt ?? 0),
    };
  }

  /**
   * Get all distributions with pagination
   */
  // static async getAllDistributions(
  //   page = 1,
  //   limit = 10,
  //   status?: DistributionAttributes["status"]
  // ): Promise<{ distributions: DistributionAttributes[]; total: number }> {
  //   const skip = (page - 1) * limit;

  //   const baseQuery = db.select().from(distributionModel);

  //   const listQuery = status
  //     ? baseQuery.where(eq(distributionModel.status, status))
  //     : baseQuery;

  //   const countQuery = status
  //     ? db
  //         .select({ cnt: count() })
  //         .from(distributionModel)
  //         .where(eq(distributionModel.status, status))
  //     : db.select({ cnt: count() }).from(distributionModel);

  //   const [distributions, total] = await Promise.all([
  //     listQuery
  //       .orderBy(desc(distributionModel.created_at))
  //       .limit(limit)
  //       .offset(skip),
  //     countQuery,
  //   ]);

  //   return {
  //     distributions: distributions as DistributionAttributes[],
  //     total: Number(total[0]?.cnt ?? 0),
  //   };
  // }

  /**
   * Get distributions statistics
   */
  static async getDistributionStats(user_address: string) {
    const userAddressQuery = eq(distributionModel.user_address, user_address);

    const [total, completed, failed, pending] = await Promise.all([
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(userAddressQuery),

      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(
          and(userAddressQuery, eq(distributionModel.status, "completed"))
        ),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(and(userAddressQuery, eq(distributionModel.status, "failed"))),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(and(userAddressQuery, eq(distributionModel.status, "pending"))),
    ]);

    return {
      total: Number(total[0]?.cnt ?? 0),
      completed: Number(completed[0]?.cnt ?? 0),
      failed: Number(failed[0]?.cnt ?? 0),
      pending: Number(pending[0]?.cnt ?? 0),
    };
  }

  /**
   * Get total amount sent by a user
   */
  static async getTotalAmount(user_address: string) {
    const result = await db
      .select({
        tokenSymbol: distributionModel.token_symbol,
        totalAmount: sum(distributionModel.total_amount),
      })
      .from(distributionModel)
      .where(
        and(
          eq(distributionModel.user_address, user_address),
          eq(
            distributionModel.status,
            "COMPLETED" as (typeof distributionStatus)[number]
          )
        )
      )
      .groupBy(distributionModel.token_symbol);

    const { data } = await tryCatch(fetchTokenPrices(["starknet", "ethereum"]));

    const starknetUsdPrice = data?.["starknet"]?.usd ?? 0;

    const ethereumPrice = data?.["ethereum"]?.usd ?? 0;

    const totalAmount = result
      .map((row) => {
        const usdPrice =
          row.tokenSymbol === "STRK"
            ? CurrencyJs(Number(row?.totalAmount ?? 0), {
                precision: 4,
              }).multiply(starknetUsdPrice).value
            : row.tokenSymbol === "ETH"
            ? CurrencyJs(Number(row?.totalAmount ?? 0), {
                precision: 4,
              }).multiply(ethereumPrice).value
            : Number(row?.totalAmount ?? 0);

        return {
          ...row,
          totalAmount: usdPrice,
        };
      })
      .reduce(
        (acc, curr) =>
          CurrencyJs(acc, { precision: 4 }).add(curr.totalAmount).value,
        0
      );

    return totalAmount ?? 0;
  }

  /**
   * Get total distributions made by a user
   */
  static async getTotalDistributions(user_address: string) {
    if (!user_address) return 0;

    const [result] = await db
      .select({ total_distributions: count() })
      .from(distributionModel)
      .where(
        and(
          eq(distributionModel.user_address, user_address),
          eq(
            distributionModel.status,
            "COMPLETED" as (typeof distributionStatus)[number]
          )
        )
      );

    return Number(result?.total_distributions ?? 0);
  }

  /**
   * Get user's total addresses funded
   */
  static async getTotalFundedAddresses(user_address: string) {
    if (!user_address) return 0;

    const [result] = await db
      .select({ total_recipients: sum(distributionModel.total_recipients) })
      .from(distributionModel)
      .where(
        and(
          eq(distributionModel.user_address, user_address),
          eq(
            distributionModel.status,
            "COMPLETED" as (typeof distributionStatus)[number]
          )
        )
      );

    return Number(result?.total_recipients ?? 0);
  }
}
