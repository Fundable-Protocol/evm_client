import { z } from "zod";

const csvRowSchema = z.object({
  address: z.string().length(66), // length of Ethereum address
  amount: z.coerce.number().positive(),
});

export const csvSchema = z.array(csvRowSchema);
