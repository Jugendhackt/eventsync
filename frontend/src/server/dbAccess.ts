"use server";

import { eq } from "drizzle-orm";
import { db } from "."; //drizzle
import { events } from "./schema";
import { InferSelectModel } from "drizzle-orm/table";

export async function loadDataFromDrizzle():Promise<InferSelectModel<typeof events>[]> {
    "use server";
    const data = (await db.select().from(events).where(eq(events.verified, true)));
    return data;
}

export async function addEventToDrizzle(event:InferSelectModel<typeof events>):Promise<void> {
    "use server";
    await db.insert(events).values(event);
}

export async function getAdminEvents():Promise<InferSelectModel<typeof events>[]> {
    "use server";
    const data = await db.select().from(events).where(eq(events.verified, false));
    return data;
}

//TODO check permissions
export async function verifyEvent(event:InferSelectModel<typeof events>):Promise<void> {
    "use server"
    await db.update(events).set({verified: true}).where(eq(events.id, event.id));
}

//TODO check permissions
export async function deleteEvent(event:InferSelectModel<typeof events>):Promise<void> {
    "use server"
    await db.delete(events).where(eq(events.id, event.id));
}
