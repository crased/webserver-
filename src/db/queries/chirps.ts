import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function saveChirp(body: string, userId: string) {
  const result = await db
    .insert(chirps)
    .values({ 
       body: body,
       userId: userId,})
    .returning();
  return result[0];
}

export async function getChirps() {
  const result = await db
    .select()
    .from(chirps)
    .orderBy(asc(chirps.createdAt))
  return result;  
}

export async function getChirp(id: string) {
  const result = await db
  .select()
  .from(chirps)
  .where(eq(chirps.id, id)) 
  return result[0];
}


export async function deleteChirp(id: string) {
const result = await db
.delete(chirps)
.where(eq(chirps.id, id))
return result;
}

export async function getChirpsByAuthorId(authorId: string) {
const result = await db
.select()
.from(chirps)
.where(eq(chirps.userId, authorId))
return result
}