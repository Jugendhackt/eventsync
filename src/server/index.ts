"use server";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { events } from './schema';
const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);
