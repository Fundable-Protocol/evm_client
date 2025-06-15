import { generateUUID } from "@/lib/utills";
import { network } from "./distribution-schema";

import { numeric, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const feeConfigModel = pgTable(
  "FeeConfig",
  {
    id: text().$default(generateUUID).primaryKey().notNull(),
    network: network().notNull(),
    chainId: text("chain_id").notNull(),
    chainName: text("chain_name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    amount: numeric("amount", { precision: 65, scale: 30 }).notNull(),
  },
  (table) => ({
    uniqueNetwork: unique().on(table.chainName, table.network, table.chainId),
  })
);
