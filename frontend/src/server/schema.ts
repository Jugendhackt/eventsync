"use server";
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
export const events = sqliteTable('events', {
    id: text('id'),
    lat: integer('lat'),
    lon: integer('lon'),
    name: text('name'),
    author: text('author'),
    location: text('location'),
    hrtime: text('hrtime'),
    deleteAfter: integer('deleteAfter'),
    time: text('time'),
    website: text('website'),
    tags: text('tags'),
    desc: text('desc'),
    createTime: text('createTime'),

  });
