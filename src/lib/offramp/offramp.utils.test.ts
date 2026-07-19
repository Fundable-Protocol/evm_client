import { describe, expect, it } from "vitest";

import {
  calculateFeeAdjustedRate,
  calculateFiatFee,
  getOfframpBalanceState,
  getPollingInterval,
  getRemainingSeconds,
  filterOfframpBanks,
  isTerminalOfframpStatus,
  normalizeManualOfframpOrder,
  unwrapOfframpResponse,
} from "./offramp.utils";
import { OFFRAMP_MODES } from "../../types/offramp";

describe("offramp utilities", () => {
  it("filters banks by a case-insensitive partial name", () => {
    const banks = [
      { code: "044", name: "Access Bank" },
      { code: "058", name: "Guaranty Trust Bank" },
      { code: "033", name: "United Bank for Africa" },
    ];

    expect(filterOfframpBanks(banks, "  trust ")).toEqual([
      { code: "058", name: "Guaranty Trust Bank" },
    ]);
    expect(filterOfframpBanks(banks, "")).toEqual(banks);
  });

  it("unwraps the backend response envelope", () => {
    expect(unwrapOfframpResponse({ status: true, data: { rate: 1378 } })).toEqual({
      rate: 1378,
    });
  });

  it("keeps unwrapped country responses intact", () => {
    const countries = [{ code: "NG", currency: "NGN" }];

    expect(unwrapOfframpResponse(countries)).toEqual(countries);
  });

  it("converts the crypto fee to fiat for the quote summary", () => {
    expect(calculateFiatFee(0.01, 1378)).toBe(13.78);
  });

  it("deducts the fee percentage from the displayed exchange rate", () => {
    expect(calculateFeeAdjustedRate(1386.5, 0.1)).toBe(1385.1135);
  });

  it("keeps the entered gross amount as the walletless deposit amount", () => {
    const order = {
      transactionReference: "FND-test",
      status: "initiated",
      depositAddress: "0x0717" as const,
      depositAmount: 10.01,
      depositToken: "USDT",
      depositNetwork: "bnb-smart-chain",
      fiatAmount: 13852.83,
      currency: "NGN",
      accessToken: "guest-token",
    };

    expect(normalizeManualOfframpOrder(order, 10)).toMatchObject({
      depositAmount: 10,
      transactionReference: "FND-test",
      accessToken: "guest-token",
    });
    expect(order.depositAmount).toBe(10.01);
  });

  it("does not reject a zero wallet balance before a quote is available", () => {
    expect(
      getOfframpBalanceState(OFFRAMP_MODES.connected, 0, null),
    ).toEqual({
      hasSufficientBalance: true,
      showInsufficientBalance: false,
    });
  });

  it("reports an insufficient balance after a quote defines the total debit", () => {
    expect(
      getOfframpBalanceState(OFFRAMP_MODES.connected, 0, 1.02),
    ).toEqual({
      hasSufficientBalance: false,
      showInsufficientBalance: true,
    });
  });

  it("uses fast polling for the first fifteen seconds", () => {
    expect(getPollingInterval(0)).toBe(1000);
    expect(getPollingInterval(14_999)).toBe(1000);
    expect(getPollingInterval(15_000)).toBe(3000);
  });

  it("treats completed, failed, and expired as terminal", () => {
    expect(isTerminalOfframpStatus("completed")).toBe(true);
    expect(isTerminalOfframpStatus("failed")).toBe(true);
    expect(isTerminalOfframpStatus("expired")).toBe(true);
    expect(isTerminalOfframpStatus("processing_payment")).toBe(false);
  });

  it("never returns a negative countdown", () => {
    expect(
      getRemainingSeconds(
        "2026-07-15T12:00:05.000Z",
        Date.parse("2026-07-15T12:00:00.000Z"),
      ),
    ).toBe(5);
    expect(
      getRemainingSeconds(
        "2026-07-15T11:59:59.000Z",
        Date.parse("2026-07-15T12:00:00.000Z"),
      ),
    ).toBe(0);
  });
});
