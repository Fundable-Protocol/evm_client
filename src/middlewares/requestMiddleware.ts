import { NextRequest, NextResponse } from "next/server";

import { apiSecretKey } from "@/lib/constant";

type APIHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

export function validateApiKey(handler: APIHandler): APIHandler {
  return async (req: NextRequest) => {
    if (!apiSecretKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req);
  };
}
