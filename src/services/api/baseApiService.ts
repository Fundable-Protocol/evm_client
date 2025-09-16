import { backendBaseUrl } from "@/lib/constant";

export class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = backendBaseUrl;
  }

  public async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    walletId?: string
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      if (!walletId) {
        return {
          success: false,
          error: "Wallet ID is required",
        };
      }

      const response = await fetch(`${this.baseURL}/api${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          "x-wallet-id": walletId ?? "", // use current user wallet id
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data?.info?.message || "Invalid Session",
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      };
    }
  }
}

export const baseApiService = new ApiService();
