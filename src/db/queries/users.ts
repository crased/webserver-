import { createHashPassword, checkPasswordHash } from "../../middleware/auth.js";
import { db } from "../index.js";
import { NewUser, users  } from "../schema.js";
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
const [user] = await db.select({  hashedPassword: users.hashedPassword }).from(users).where(eq(users.email, email))
return user;
};

export async function login(email: string) {
const [user] = await db.select().from(users).where(eq(users.email, email))
return user;
}