"use server";

import { z } from "zod";

import {
  distributionQuerySchema,
  updateDistributionSchema,
  createDistributionSchema,
} from "@/policies/distribution";

import { DistributionService } from "@/services/distributionService";

export async function createDistributionAction(
  data: z.infer<typeof createDistributionSchema>
) {
  // Directly call your service function
  const distribution = await DistributionService.createDistribution(data);

  return distribution;
}

export async function getDistributionsAction(
  params: Partial<z.infer<typeof distributionQuerySchema>>
) {
  // Validate params using zod
  const validatedParams = distributionQuerySchema.parse(params);

  const { page = 1, limit = 10, status, user_address } = validatedParams;

  if (user_address) {
    return DistributionService.getDistributionsByUser(
      user_address,
      page,
      limit
    );
  }

  return DistributionService.getAllDistributions(page, limit, status);
}

export async function updateDistributionAction(
  distributionId: string,
  data: z.infer<typeof updateDistributionSchema>
) {
  if (!distributionId) {
    throw new Error("Distribution ID is required");
  }

  // Validate params using zod
  const validatedData = updateDistributionSchema.parse(data);

  // You can optionally validate `data` shape here or inside the service

  return DistributionService.updateDistribution(distributionId, validatedData);
}
