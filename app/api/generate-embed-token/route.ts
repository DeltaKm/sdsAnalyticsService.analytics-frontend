import { NextResponse } from "next/server";
import { z } from "zod";
import {
  signEmbedToken,
  EMBED_TOKEN_TTL_SECONDS,
  buildEmbedUrl,
} from "@/lib/embed/session";

const requestSchema = z.object({
  tenantId: z.string().min(1),
  userId: z.string().min(1),
  permissions: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantId, userId, permissions } = requestSchema.parse(body);

    const token = await signEmbedToken({ tenantId, userId, permissions });
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
