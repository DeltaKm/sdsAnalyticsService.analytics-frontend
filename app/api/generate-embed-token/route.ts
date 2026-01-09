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
    const expectedKey = process.env.EMBED_API_KEY;
    if (!expectedKey) {
      console.error("EMBED_API_KEY env var is not configured");
      return NextResponse.json(
        { message: "Server misconfiguration" },
        { status: 500 },
      );
    }

    const providedKey = request.headers.get(API_KEY_HEADER);
    if (providedKey !== expectedKey) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { uniqueKey, userId, permissions } = requestSchema.parse(body);

    const token = await signEmbedToken({ uniqueKey, userId, permissions });
    const embedUrl = buildEmbedUrl(token);

    return NextResponse.json({
      embedUrl,
      expiresIn: EMBED_TOKEN_TTL_SECONDS,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request payload", issues: error.issues },
        { status: 400 },
      );
    }

    console.error("Failed to generate embed token", error);
    return NextResponse.json(
      { message: "Failed to generate embed token" },
      { status: 500 },
    );
  }
}
