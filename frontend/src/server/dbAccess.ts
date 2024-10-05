"use server";

import { db } from "."; //drizzle
import { events } from "./schema";
import { InferSelectModel } from "drizzle-orm/table";

export async function loadDataFromDrizzle():Promise<InferSelectModel<typeof events>[]> {
    "use server";
    const data = await db.select().from(events);
    return data;
}

export async function addEventToDrizzle(event:InferSelectModel<typeof events>):Promise<void> {
    "use server";
    await db.insert(events).values(event);
}