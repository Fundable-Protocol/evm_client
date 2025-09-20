import { baseApiService } from "./baseApiService";
import type { StreamRecord } from "@/types/payment-stream";

class _PaymentStreamApiService {
  async getStreams(walletId: string, params?: unknown) {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (![undefined, null, ""].includes(value)) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();

    const endpoint = `/payment-streams?${queryString}`;

    return baseApiService.makeRequest<{
      success: boolean;
      paymentStreams: StreamRecord[];
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

  async getStreamById(walletId: string, id: string) {
    return baseApiService.makeRequest<{
      success: boolean;
      stream: StreamRecord;
    }>(`/payment-streams/${id}`, { method: "GET" }, walletId);
  }

  async createStream(walletId: string, data: Partial<StreamRecord>) {
    return baseApiService.makeRequest<{
      success: boolean;
      stream: StreamRecord;
    }>(
      "/payment-streams",
      { method: "POST", body: JSON.stringify(data) },
      walletId
    );
  }

  async getStreamStats(walletId: string) {
    return baseApiService.makeRequest<{
      success: boolean;
      stats: unknown;
    }>(
      `/payment-streams/stats?user_address=${walletId}`,
      { method: "GET" },
      walletId
    );
  }
}

const PaymentStreamApiService = new _PaymentStreamApiService();

export default PaymentStreamApiService;
