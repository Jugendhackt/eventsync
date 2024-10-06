import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm/table";

export const events = sqliteTable('events', {
    event_id: text('id').primaryKey().unique(),
    lat: real('lat').notNull(),
    lon: real('lon').notNull(),
    name: text('name').notNull(),
    author: text('author').notNull(),
    location: text('location').notNull(),
    hrtime: text('hrtime'),
    deleteAfter: integer('deleteAfter', { mode: 'boolean' }),
    time: text('time'),
    website: text('website').notNull(),
    tags: text('tags').notNull(),
    description: text('description').notNull(),
    createTime: text('createTime').default(sql`CURRENT_TIMESTAMP`),
    verified: integer('verified', { mode: 'boolean' }),

  });

  export const users = sqliteTable("users", {
    user_id: text("user_id").primaryKey().unique(),
    username: text("username").notNull(),
    hashed_password: text("hashed_password").notNull(),
    display_name: text("display_name").notNull(),
    is_admin: integer("is_admin", { mode: "boolean" }),
  });

  export const likes = sqliteTable("likes", {
    user_id: text("user_id").notNull(),
    event_id: text("event_id").notNull(),
  });

  export type MapEvent = InferSelectModel<typeof events>;
  export type User = InferSelectModel<typeof users>;
  export type Like = InferSelectModel<typeof likes>;