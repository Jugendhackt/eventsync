import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm/table";

export const events = sqliteTable('events', {
    id: text('id').primaryKey().unique(),
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

  export type MapEvent = InferSelectModel<typeof events>;