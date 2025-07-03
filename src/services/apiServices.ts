// services/apiService.ts

import { z } from "zod";

import {
  createDistributionSchema,
  updateDistributionSchema,
} from "@/policies/distribution";

import { PriceCache } from "@/types/dashboard";

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

let priceCache: PriceCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const fetchTokenPrices = async (tokenIds = ["starknet", "ethereum"]) => {
  // In-memory cache for token prices

  const now = Date.now();

  // Check if we have a valid cache
  if (
    priceCache &&
    now - priceCache.timestamp < CACHE_DURATION &&
    tokenIds.every((id) => id in priceCache!.prices)
  ) {
    return priceCache.prices;
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(
        ","
      )}&vs_currencies=usd`
    );

    if (!response.ok) throw new Error("Failed to fetch token prices");

    const data = await response.json();

    // Update cache with new prices
    priceCache = {
      prices: data,
      timestamp: now,
    };

    return data;
  } catch {
    // console.error("Error fetching token prices:", error);

    // If we have cached data, return it even if expired
    if (priceCache) return priceCache.prices;

    return {};
  }
};
