// services/apiService.ts

import {
  createDistributionSchema,
  updateDistributionSchema,
} from "@/policies/distribution";
import { z } from "zod";

const distributionBaseUrl = "/api/distributions";

export const apiService = {
  async getDistributions(params?: Record<string, string>) {
    const url = new URL(distributionBaseUrl, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.set(key, value)
      );
    }

    const res = await fetch(url.toString());

    if (!res.ok) throw new Error("Failed to fetch distributions");

    return res.json();
  },

  async createDistribution(data: z.infer<typeof createDistributionSchema>) {
    const res = await fetch(distributionBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();

      throw new Error(json.error || "Failed to create distribution");
    }

    return res.json();
  },

  async updateDistribution(
    id: string,
    data: z.infer<typeof updateDistributionSchema>
  ) {
    const url = new URL(distributionBaseUrl, window.location.origin);

    url.searchParams.set("distributionId", id);

    const res = await fetch(url.toString(), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update distribution");

    return res.json();
  },
};
