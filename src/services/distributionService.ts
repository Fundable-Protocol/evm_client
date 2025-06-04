import { DistributionAttributes } from "@/types/distribution";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../db/drizzle";
import { distributionModel } from "../../db/schema";
import { z } from "zod";
import {
  createDistributionSchema,
  updateDistributionSchema,
} from "@/policies/distribution";

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
  static async getDistribution(
    id: string
  ): Promise<DistributionAttributes | null> {
    const [dist] = await db
      .select()
      .from(distributionModel)
      .where(eq(distributionModel.id, id))
      .limit(1); // Fetch single row

    return (dist as DistributionAttributes) || null;
  }

  /**
   * Get distributions by user address
   */
  static async getDistributionsByUser(
    user_address: string,
    page = 1,
    limit = 10
  ): Promise<{ distributions: DistributionAttributes[]; total: number }> {
    const skip = (page - 1) * limit;

    const [distributions, total] = await Promise.all([
      db
        .select()
        .from(distributionModel)
        .where(eq(distributionModel.user_address, user_address))
        .orderBy(desc(distributionModel.created_at))
        .limit(limit)
        .offset(skip),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(eq(distributionModel.user_address, user_address)),
    ]);

    return {
      distributions: distributions as DistributionAttributes[],
      total: Number(total[0]?.cnt ?? 0),
    };
  }

  /**
   * Get all distributions with pagination
   */
  static async getAllDistributions(
    page = 1,
    limit = 10,
    status?: DistributionAttributes["status"]
  ): Promise<{ distributions: DistributionAttributes[]; total: number }> {
    const skip = (page - 1) * limit;

    const baseQuery = db.select().from(distributionModel);

    const listQuery = status
      ? baseQuery.where(eq(distributionModel.status, status))
      : baseQuery;

    const countQuery = status
      ? db
          .select({ cnt: count() })
          .from(distributionModel)
          .where(eq(distributionModel.status, status))
      : db.select({ cnt: count() }).from(distributionModel);

    const [distributions, total] = await Promise.all([
      listQuery
        .orderBy(desc(distributionModel.created_at))
        .limit(limit)
        .offset(skip),
      countQuery,
    ]);

    return {
      distributions: distributions as DistributionAttributes[],
      total: Number(total[0]?.cnt ?? 0),
    };
  }

  /**
   * Get distributions statistics
   */
  static async getDistributionStats(user_address?: string) {
    const baseWhere = user_address
      ? eq(distributionModel.user_address, user_address)
      : undefined;

    const [total, completed, failed, pending] = await Promise.all([
      baseWhere
        ? db.select({ cnt: count() }).from(distributionModel).where(baseWhere)
        : db.select({ cnt: count() }).from(distributionModel),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(
          baseWhere
            ? and(baseWhere, eq(distributionModel.status, "completed"))
            : eq(distributionModel.status, "completed")
        ),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(
          baseWhere
            ? and(baseWhere, eq(distributionModel.status, "failed"))
            : eq(distributionModel.status, "failed")
        ),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(
          baseWhere
            ? and(baseWhere, eq(distributionModel.status, "pending"))
            : eq(distributionModel.status, "pending")
        ),
    ]);

    return {
      total: Number(total[0]?.cnt ?? 0),
      completed: Number(completed[0]?.cnt ?? 0),
      failed: Number(failed[0]?.cnt ?? 0),
      pending: Number(pending[0]?.cnt ?? 0),
    };
  }
}
