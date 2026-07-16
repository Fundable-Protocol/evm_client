import { afterEach, describe, expect, it, vi } from "vitest";

import { OfframpApiError, OfframpService } from "./offrampService";

describe("OfframpService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the guest access token when polling a manual order", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: true,
          data: {
            transactionReference: "FND-test",
            status: "pending",
            stage: "awaiting_deposit",
            expiresAt: null,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const service = new OfframpService("https://api.example.com");
    await service.getManualStatus("FND-test", "guest-token");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/offramp/manual/FND-test/status",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-offramp-access-token": "guest-token",
        }),
      }),
    );
  });

  it("does not expose a backend error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            info: { message: "Paycrest refund address is not configured" },
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const service = new OfframpService("https://api.example.com");

    await expect(service.getAssets()).rejects.toEqual(
      expect.objectContaining<Partial<OfframpApiError>>({
        message:
          "Supported tokens are unavailable right now. Please try again shortly.",
      }),
    );
  });
});
