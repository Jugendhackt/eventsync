import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm/table";

export const events = sqliteTable('events', {
    id: text('id').primaryKey().unique(),
    lat: integer('lat').notNull(),
    lon: integer('lon').notNull(),
    name: text('name').notNull(),
    author: text('author').notNull(),
    location: text('location').notNull(),
    hrtime: text('hrtime'),
    deleteAfter: integer('deleteAfter', { mode: 'boolean' }),
    time: text('time'),
    website: text('website').notNull(),
    tags: text('tags').notNull(),
    description: text('description').notNull(),
    createTime: text('createTime').default(sql`CURRENT_TIMESTAMP`)

  });

  export type MapEvent = InferSelectModel<typeof events>;