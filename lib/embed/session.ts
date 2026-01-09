import { SignJWT, jwtVerify } from "jose";
import {
  EMBED_SESSION_COOKIE,
  EMBED_TOKEN_TTL_SECONDS,
  EMBED_JWT_ALGORITHM,
} from "./constants";

export { EMBED_SESSION_COOKIE, EMBED_TOKEN_TTL_SECONDS } from "./constants";

export type EmbedTokenClaims = {
  uniqueKey: string;
  userId?: string;
  permissions: string[];
};

export type EmbedSession = EmbedTokenClaims & {
  iat: number;
  exp: number;
};

type SignParams = EmbedTokenClaims & {
  expiresInSeconds?: number;
};

const encoder = new TextEncoder();

function getSecretKey(): Uint8Array {
  const secret = process.env.EMBED_JWT_SECRET;
  if (!secret) {
    throw new Error("EMBED_JWT_SECRET env var is not defined");
  }
  return encoder.encode(secret);
}

export async function signEmbedToken({
  uniqueKey,
  userId,
  permissions,
  expiresInSeconds = EMBED_TOKEN_TTL_SECONDS,
}: SignParams): Promise<string> {
  const secret = getSecretKey();
  const issuedAt = Math.floor(Date.now() / 1000);
  const expirationTime = issuedAt + expiresInSeconds;
  const resolvedUser = userId ?? "embed-user";

  return await new SignJWT({ uniqueKey, userId: resolvedUser, permissions })
    .setProtectedHeader({ alg: EMBED_JWT_ALGORITHM, typ: "JWT" })
    .setIssuedAt(issuedAt)
    .setExpirationTime(expirationTime)
    .sign(secret);
}

export async function verifyEmbedToken(token: string): Promise<EmbedSession> {
  const secret = getSecretKey();
  const { payload } = await jwtVerify(token, secret, {
    algorithms: [EMBED_JWT_ALGORITHM],
  });

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid embed token payload");
  }

  const { uniqueKey, userId, permissions } = payload as Partial<EmbedSession>;

  if (
    typeof uniqueKey !== "string" ||
    !Array.isArray(permissions)
  ) {
    throw new Error("Embed token missing required claims");
  }

  if (userId !== undefined && typeof userId !== "string") {
    throw new Error("Embed token userId must be a string if provided");
  }

  return payload as EmbedSession;
}

export async function tryVerifyEmbedToken(
  token: string | null | undefined,
): Promise<EmbedSession | null> {
  if (!token) return null;
  try {
    return await verifyEmbedToken(token);
  } catch (error) {
    console.warn("Failed to verify embed token", error);
    return null;
  }
}

export function buildEmbedUrl(token: string): string {
  const baseUrl = process.env.EMBED_BASE_URL ?? "https://analytics.example.com";
  const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalized}/embed?token=${token}`;
}
