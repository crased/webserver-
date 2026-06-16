import { createHashPassword, checkPasswordHash } from "../../middleware/auth.js";
import { db } from "../index.js";
import { NewUser, users, refreshTokens } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function findUser(email: string) {
const [user] = await db.select({  hashedPassword: users.hashedPassword, id: users.id }).from(users).where(eq(users.email, email))
return user;
};

export async function login(email: string) {
const [user] = await db.select().from(users).where(eq(users.email, email))
return user;
}

export async function saveRefreshToken(userId: string, token: string) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 60);
  const [row] = await db.insert(refreshTokens).values({
    token: token,
    userId: userId,
    expiresAt: expiresAt,
    revokedAt: null,
  }).returning();
  return row;
}

export async function updateUser(email: string, hashedPassword: string, userId: string) {
const [result] = await db.update(users)
.set({email, hashedPassword: hashedPassword})
.where(eq(users.id, userId))
.returning();
return result;
}

export async function upgradeUser(id: string) {
const [result] = await db.update(users)
.set({isChirpyRed: true})
.where(eq(users.id, id))
.returning();
return result;
}