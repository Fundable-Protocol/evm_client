import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { databaseUrl } from "@/lib/constant";

const client = neon(databaseUrl);

export const db = drizzle(client, {
  casing: "snake_case",
});
