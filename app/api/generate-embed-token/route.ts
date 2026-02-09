import { NextResponse } from "next/server";
import { z } from "zod";
import {
  signEmbedToken,
  EMBED_TOKEN_TTL_SECONDS,
  buildEmbedUrl,
} from "@/lib/embed/session";

const API_KEY_HEADER = "x-api-key";

const requestSchema = z.object({
  uniqueKey: z.string().min(1),
  userId: z.string().min(1).optional(),
  permissions: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataServiceUrl = process.env.DATA_SERVICE_BASE_URL;
    
    if (!dataServiceUrl) {
      return NextResponse.json(
        { error: "DATA_SERVICE_BASE_URL is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${dataServiceUrl}/api/generate-embed-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Data service error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to proxy embed token generation:", error);
    return NextResponse.json(
      { error: "Failed to generate embed token" },
      { status: 500 }
    );
  }
}
