import { backendBaseUrl } from "../../lib/constant";
import { OFFRAMP_MESSAGES } from "../../lib/offramp/offramp.constants";
import { unwrapOfframpResponse } from "../../lib/offramp/offramp.utils";
import type {
  AggregatedOfframpRates,
  CreateOfframpParams,
  ManualOfframpOrder,
  OfframpAccount,
  OfframpAsset,
  OfframpBank,
  OfframpCountry,
  OfframpOrder,
  OfframpPublicStatus,
  OfframpRateParams,
  VerifyOfframpAccountParams,
} from "../../types/offramp";

type SafeMessage = (typeof OFFRAMP_MESSAGES)[keyof typeof OFFRAMP_MESSAGES];

export class OfframpApiError extends Error {
  constructor(message: SafeMessage, readonly status?: number) {
    super(message);
    this.name = "OfframpApiError";
  }
}

export class OfframpService {
  private readonly baseUrl: string;

  constructor(baseUrl = backendBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    safeMessage: SafeMessage = OFFRAMP_MESSAGES.unavailable,
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new OfframpApiError(safeMessage, response.status);
      }

      return unwrapOfframpResponse<T>(payload);
    } catch (error) {
      if (error instanceof OfframpApiError) throw error;
      throw new OfframpApiError(safeMessage);
    }
  }

  getAssets(network?: string): Promise<OfframpAsset[]> {
    const query = network
      ? `?${new URLSearchParams({ network }).toString()}`
      : "";
    return this.request(
      `/offramp/assets${query}`,
      {},
      OFFRAMP_MESSAGES.assetsUnavailable,
    );
  }

  getCountries(): Promise<OfframpCountry[]> {
    return this.request("/offramp/countries");
  }

  getBanks(country: string, currency: string): Promise<OfframpBank[]> {
    const query = new URLSearchParams({
      country,
      currency,
      providerId: "paycrest",
    });
    return this.request(
      `/offramp/banks?${query.toString()}`,
      {},
      OFFRAMP_MESSAGES.banksUnavailable,
    );
  }

  verifyAccount(params: VerifyOfframpAccountParams): Promise<OfframpAccount> {
    return this.request(
      "/offramp/verify-account",
      { method: "POST", body: JSON.stringify(params) },
      OFFRAMP_MESSAGES.accountUnavailable,
    );
  }

  getRates(
    params: OfframpRateParams,
    manual: boolean,
  ): Promise<AggregatedOfframpRates> {
    const query = new URLSearchParams({
      ...params,
      amount: String(params.amount),
    });
    return this.request(
      `/offramp/${manual ? "manual/rates" : "rates"}?${query.toString()}`,
      {},
      OFFRAMP_MESSAGES.ratesUnavailable,
    );
  }

  createConnected(
    params: CreateOfframpParams,
    walletAddress: string,
  ): Promise<OfframpOrder> {
    return this.request(
      "/offramp/create",
      {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "x-wallet-id": walletAddress },
      },
      OFFRAMP_MESSAGES.orderUnavailable,
    );
  }

  createManual(params: CreateOfframpParams): Promise<ManualOfframpOrder> {
    return this.request(
      "/offramp/manual/create",
      { method: "POST", body: JSON.stringify(params) },
      OFFRAMP_MESSAGES.orderUnavailable,
    );
  }

  getConnectedStatus(
    reference: string,
    walletAddress: string,
  ): Promise<OfframpPublicStatus> {
    return this.request(
      `/offramp/status/${encodeURIComponent(reference)}`,
      { headers: { "x-wallet-id": walletAddress } },
      OFFRAMP_MESSAGES.statusUnavailable,
    );
  }

  getManualStatus(
    reference: string,
    accessToken: string,
  ): Promise<OfframpPublicStatus> {
    return this.request(
      `/offramp/manual/${encodeURIComponent(reference)}/status`,
      { headers: { "x-offramp-access-token": accessToken } },
      OFFRAMP_MESSAGES.statusUnavailable,
    );
  }

  confirmManualDeposit(
    reference: string,
    accessToken: string,
  ): Promise<OfframpPublicStatus> {
    return this.request(
      `/offramp/manual/${encodeURIComponent(reference)}/confirm-deposit`,
      {
        method: "POST",
        headers: { "x-offramp-access-token": accessToken },
      },
      OFFRAMP_MESSAGES.statusUnavailable,
    );
  }
}

export const offrampService = new OfframpService();
