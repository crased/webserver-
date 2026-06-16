import { boolean } from "drizzle-orm/pg-core";
import { pgTable, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").notNull(),
  isChirpyRed: boolean("is_chirpy_red").default(false).notNull()
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  body: text('body').notNull(),
  userId: uuid("user_id")
  .references(() => (users.id), { onDelete: 'cascade' })
  .notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
token: text('token').primaryKey(),
createdAt: timestamp("created_at").notNull().defaultNow(),
updatedAt: timestamp("updated_at").notNull().defaultNow(),
userId: uuid("user_id")
.references(() => (users.id), { onDelete: 'cascade' })
.notNull(),
expiresAt: timestamp("expires_at").notNull(),
revokedAt: timestamp("revoked_at")
});




export type NewUser = typeof users.$inferInsert;
