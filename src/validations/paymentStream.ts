import { z } from "zod";
import { isValidStarknetAddress } from ".";
import type { AppSelectProps } from "@/types";

export const createPaymentStreamSchema = (
  tokenOptions: AppSelectProps["options"],
  durationOptions: AppSelectProps["options"]
) => {
  const allowedTokens = new Set(tokenOptions.map((o) => String(o.value)));
  const allowedDurations = new Set(durationOptions.map((o) => String(o.value)));

  return z.object({
    name: z.string().trim().min(1, "Name is required"),
    recipient: z
      .string()
      .trim()
      .refine((val) => isValidStarknetAddress(val), "Invalid Starknet address"),
    token: z
      .string()
      .refine((val) => allowedTokens.has(String(val)), "Invalid token selected"),
    amount: z
      .string()
      .trim()
      .refine((val) => val.length > 0, "Total amount is required")
      .refine((val) => !Number.isNaN(Number(val)), "Total amount must be a number")
      .refine((val) => Number(val) > 0, "Total amount must be greater than 0"),
    duration: z
      .string()
      .refine(
        (val) => allowedDurations.has(String(val)),
        "Invalid duration selected"
      ),
    durationValue: z
      .string()
      .trim()
      .refine((val) => val.length > 0, "Duration value is required")
      .refine((val) => !Number.isNaN(Number(val)), "Duration value must be a number")
      .refine((val) => Number(val) > 0, "Duration cannot be 0")
      .refine((val) => /^(?:[1-9]\d*)$/.test(val), "Enter a valid whole number"),
    cancellability: z.boolean(),
    transferability: z.boolean(),
  });
};

