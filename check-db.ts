
import { db } from "./db/drizzle";
import { distributionModel } from "./db/schema";
import { count } from "drizzle-orm";

async function checkDb() {
  try {
    const result = await db.select({ cnt: count() }).from(distributionModel);
    console.log("Distribution count:", result[0].cnt);
    
    if (result[0].cnt > 0) {
      const samples = await db.select().from(distributionModel).limit(5);
      console.log("Sample records:", JSON.stringify(samples, null, 2));
    }
  } catch (error) {
    console.error("Error checking DB:", error);
  }
}

checkDb();
