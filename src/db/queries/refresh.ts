import { db } from "../index.js";
import { eq, and, gt, isNull } from "drizzle-orm";
import { refreshTokens, users } from "../schema.js";

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}

export async function refreshToken(token: string) {
const [result] = await db
  .select({ user: users })
  .from(users)
  .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
  .where(
    and(
      eq(refreshTokens.token, token),
      gt(refreshTokens.expiresAt, new Date()),
      isNull(refreshTokens.revokedAt),
    )
  );
return result;    
}