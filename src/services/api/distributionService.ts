import { baseApiService } from "./baseApiService";
import { DistributionAttributes } from "@/types/distribution";

class _DistributionApiService {
  async getDistributions(walletId: string, params?: unknown) {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();

    const endpoint = `/distributions?${queryString}`;

    return baseApiService.makeRequest<{
      success: boolean;
      distributions: DistributionAttributes[];
      meta: {
        perPage: number;
        nextPage: number;
        totalRows: number;
        totalPages: number;
        currentPage: number;
        prevPage: number | null;
      };
    }>(endpoint, { method: "GET" }, walletId);
  }

  async getDistributionById(walletId: string, id: string) {
    return baseApiService.makeRequest<{
      success: boolean;
      distribution: DistributionAttributes;
    }>(`/distributions/${id}`, { method: "GET" }, walletId);
  }

  async createDistribution(walletId: string, data: DistributionAttributes) {
    return baseApiService.makeRequest<{
      success: boolean;
      distribution: DistributionAttributes;
    }>(
      "/distributions",
      { method: "POST", body: JSON.stringify(data) },
      walletId
    );
  }

  async extractAddressesFromTweetUrl(
    walletId: string,
    data: {
      url: string;
      platform: "twitter";
      addressType: "starknet";
    }
  ) {
    return baseApiService.makeRequest<{
      success: boolean;
      platform: string;
      addresses: [{ type: string; address: string }];
      total: number;
    }>(
      `/social/extract-addresses`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      walletId
    );
  }

  async getDistributionStats(walletId: string) {
    return baseApiService.makeRequest<{
      success: boolean;
      totalAmount: number;
      totalDistributions: number;
      totalFundedAddresses: number;
      totalAmountPercentageChange: number;
      totalDistributionsPercentageChange: number;
      totalFundedAddressesPercentageChange: number;
    }>(`/distributions/stats`, { method: "GET" }, walletId);
  }

  async getDistributionChartData(walletId: string) {
    return baseApiService.makeRequest<{
      success: boolean;
      chartData: unknown;
    }>(
      `/distributions/chart-data?user_address=${walletId}`,
      { method: "GET" },
      walletId
    );
  }
}

const DistributionApiService = new _DistributionApiService();

export default DistributionApiService;
