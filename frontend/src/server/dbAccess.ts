"use server";

import { and, eq } from "drizzle-orm";
import { db } from "."; //drizzle
import { events, likes, users } from "./schema";
import { InferSelectModel } from "drizzle-orm/table";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

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
    await db.update(events).set({verified: true}).where(eq(events.event_id, event.event_id));
}

//TODO check permissions
export async function deleteEvent(event:InferSelectModel<typeof events>):Promise<void> {
    "use server"
    await db.delete(events).where(eq(events.event_id, event.event_id));
}

export async function login(username:string, password:string):Promise<any> {
    "use server";

    const data = await db.select().from(users).where(eq(users.username, username));
    console.log(password);
    if(data.length === 0){
        throw new Error("User not found");
    }
    if(data[0].hashed_password !== password){
        throw new Error("Password incorrect");
    }
    let token = jwt.sign({ is_admin: data[0].is_admin, user_id: data[0].user_id, username: data[0].username }, 'shhhhh');

    return {
        user_id: data[0].user_id,
        username: data[0].username,
        display_name: data[0].display_name,
        is_admin: data[0].is_admin,
        success: true,
        token: token
    };
}

export async function register(username:string, password:string, display_name:string):Promise<any> {
    "use server";

    const id = crypto.randomUUID();
    //check username is unique
    const data = await db.select().from(users).where(eq(users.username, username));
    console.log(password);
    if(data.length !== 0){
        throw new Error("Username already taken");
    }
    await db.insert(users).values({username, hashed_password:password, display_name, is_admin: false, user_id: id});

    let token = jwt.sign({ is_admin: false, user_id: id, username: username}, 'shhhhh');

    return {
        username: username,
        display_name: display_name,
        is_admin: false,
        success: true,
        token: token
    };
}


export async function getAdminUsers():Promise<InferSelectModel<typeof users>[]> {
    "use server";
    const data = await db.select().from(users);
    return data;
}

export async function changeAdmin(user_id:string, setAdmin:boolean):Promise<void> {
    "use server";
    await db.update(users).set({is_admin: setAdmin}).where(eq(users.user_id, user_id));
}

export async function deleteUser(user_id:string):Promise<void> {
    "use server";
    await db.delete(users).where(eq(users.user_id, user_id));
}

export async function getLikedEvents(user_id:string):Promise<string[]> {
    "use server";
    const data = await db.select().from(likes).where(eq(likes.user_id, user_id));
    return data.map((like) => like.event_id);
}

export async function likeEvent(user_id:string, event_id:string, like:boolean):Promise<void> {
    "use server";
    if(like){
        await db.insert(likes).values({user_id, event_id});
    } else {
        await db.delete(likes).where(and(eq(likes.user_id, user_id), eq(likes.event_id, event_id)));
    }
}