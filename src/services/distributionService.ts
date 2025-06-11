import CurrencyJs from "currency.js";

import { z } from "zod";
import { DistributionAttributes } from "@/types/distribution";
import { and, count, desc, eq, gte, ilike, lte, sum, sql } from "drizzle-orm";

import { db } from "../../db/drizzle";

import { distributionModel } from "../../db/schema";
import {
  createDistributionSchema,
  updateDistributionSchema,
} from "@/policies/distribution";
import { distributionStatus } from "@/lib/constant";
import { fetchTokenPrices } from "./apiServices";
import { tryCatch } from "@/lib/utills";
import { IHistoryQueryParams } from "@/types/history";
import currency from "currency.js";

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
  static async getAllDistributions({
    type,
    status,
    page = 1,
    limit = 10,
    user_address,
  }: IHistoryQueryParams): Promise<{
    distributions: DistributionAttributes[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const andQuery = and(
      eq(distributionModel.user_address, user_address),
      status
        ? eq(
            distributionModel.status,
            status.toUpperCase() as DistributionAttributes["status"]
          )
        : undefined,
      type
        ? eq(
            distributionModel.distribution_type,
            type.toUpperCase() as DistributionAttributes["distribution_type"]
          )
        : undefined
    );

    const baseQuery = db
      .select({
        id: distributionModel.id,
        status: distributionModel.status,
        created_at: distributionModel.created_at,
        network: distributionModel.network,
        metadata: sql`${distributionModel.metadata}->>'recipients'`,
        user_address: distributionModel.user_address,
        token_symbol: distributionModel.token_symbol,
        total_amount: distributionModel.total_amount,
        total_recipients: distributionModel.total_recipients,
        distribution_type: distributionModel.distribution_type,
        transaction_hash: distributionModel.transaction_hash,
        fee_amount: distributionModel.fee_amount,
      })
      .from(distributionModel);

    const listQuery = baseQuery.where(andQuery);

    const countQuery = db
      .select({ cnt: count() })
      .from(distributionModel)
      .where(andQuery);

    const [distributions, total] = await Promise.all([
      listQuery
        .orderBy(desc(distributionModel.created_at))
        .limit(limit)
        .offset(skip),
      countQuery,
    ]);

    return {
      distributions: distributions?.map((distribution, i) => {
        const { metadata, ...distributionData } = distribution;

        const recipients = JSON.parse(metadata as string);

        return {
          ...distributionData,
          sn: i + 1,
          token_symbol: distributionData.token_symbol,
          total_recipients: Number(distributionData.total_recipients),
          created_at: new Date(distributionData.created_at).toLocaleString(),
          total_amount: currency(distributionData.total_amount, {
            precision: 5,
          }).value,
          fee_amount: currency(distributionData.fee_amount, {
            precision: 5,
          }).value,
          recipients: Array.isArray(recipients) ? recipients : [],
        };
      }) as unknown as DistributionAttributes[],

      total: Number(total[0]?.cnt ?? 0),
    };
  }

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

  /**
   * Get total amount sent by a user with percentage change
   */
  static async getTotalAmountWithChange(user_address: string) {
    const currentAmount = await this.getTotalAmount(user_address);

    // Get amount from 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const previousAmount = await db
      .select({
        totalAmount: sum(distributionModel.total_amount),
      })
      .from(distributionModel)
      .where(
        and(
          eq(distributionModel.user_address, user_address),
          eq(
            distributionModel.status,
            "COMPLETED" as (typeof distributionStatus)[number]
          ),
          eq(distributionModel.created_at, twentyFourHoursAgo)
        )
      );

    const previousAmountValue = Number(previousAmount[0]?.totalAmount ?? 0);

    const percentageChange =
      previousAmountValue === 0
        ? 100
        : ((currentAmount - previousAmountValue) / previousAmountValue) * 100;

    return {
      currentAmount,
      percentageChange: Number(percentageChange.toFixed(2)),
    };
  }

  /**
   * Get total distributions with percentage change
   */
  static async getTotalDistributionsWithChange(user_address: string) {
    const currentDistributions = await this.getTotalDistributions(user_address);

    // Get distributions from 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [previousDistributions] = await db
      .select({ total_distributions: count() })
      .from(distributionModel)
      .where(
        and(
          eq(distributionModel.user_address, user_address),
          eq(
            distributionModel.status,
            "COMPLETED" as (typeof distributionStatus)[number]
          ),
          eq(distributionModel.created_at, twentyFourHoursAgo)
        )
      );

    const previousDistributionsValue = Number(
      previousDistributions?.total_distributions ?? 0
    );
    const percentageChange =
      previousDistributionsValue === 0
        ? 100
        : ((currentDistributions - previousDistributionsValue) /
            previousDistributionsValue) *
          100;

    return {
      currentDistributions,
      percentageChange: Number(percentageChange.toFixed(2)),
    };
  }

  /**
   * Get total funded addresses with percentage change
   */
  static async getTotalFundedAddressesWithChange(user_address: string) {
    const currentAddresses = await this.getTotalFundedAddresses(user_address);

    // Get addresses from 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [previousAddresses] = await db
      .select({ total_recipients: sum(distributionModel.total_recipients) })
      .from(distributionModel)
      .where(
        and(
          eq(distributionModel.user_address, user_address),
          eq(
            distributionModel.status,
            "COMPLETED" as (typeof distributionStatus)[number]
          ),
          eq(distributionModel.created_at, twentyFourHoursAgo)
        )
      );

    const previousAddressesValue = Number(
      previousAddresses?.total_recipients ?? 0
    );
    const percentageChange =
      previousAddressesValue === 0
        ? 100
        : ((currentAddresses - previousAddressesValue) /
            previousAddressesValue) *
          100;

    return {
      currentAddresses,
      percentageChange: Number(percentageChange.toFixed(2)),
    };
  }

  static async getChartData(
    user_address: string,
    date: number = new Date().getTime()
  ) {
    const currentYear = new Date(date).getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // January 1st
    const endOfYear = new Date(currentYear, 11, 31); // December 31st

    const distributions = await db
      .select({
        created_at: distributionModel.created_at,
        token_symbol: distributionModel.token_symbol,
        total_amount: distributionModel.total_amount,
      })
      .from(distributionModel)
      .where(
        and(
          eq(distributionModel.user_address, user_address),
          eq(
            distributionModel.status,
            "COMPLETED" as (typeof distributionStatus)[number]
          ),
          gte(distributionModel.created_at, startOfYear),
          lte(distributionModel.created_at, endOfYear)
        )
      )
      .orderBy(distributionModel.created_at);

    return distributions.map((distribution) => ({
      ...distribution,
      total_amount: CurrencyJs(distribution.total_amount, {
        precision: 2,
      }).value,
    }));
  }
}
