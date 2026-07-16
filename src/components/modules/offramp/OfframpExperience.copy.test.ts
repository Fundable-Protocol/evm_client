import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("OfframpExperience customer-facing copy", () => {
  it("does not reveal provider or internal fee-policy terminology", () => {
    const source = readFileSync(
      new URL("./OfframpExperience.tsx", import.meta.url),
      "utf8",
    );

    expect(source).not.toMatch(
      /Paycrest|provider|Fundable fee|manual transfers/i,
    );
    expect(source).not.toContain("Connect a wallet to match its network");
    expect(source).not.toContain(
      "After the order is created, send the exact amount from an exchange or another wallet to the deposit address shown here.",
    );
  });

  it("uses the adjusted rate without showing a separate service fee", () => {
    const source = readFileSync(
      new URL("./OfframpExperience.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain("const debit = rate.totalDebit;");
    expect(source).toContain("calculateFeeAdjustedRate(");
    expect(source).not.toContain("Service fee");
  });
});
