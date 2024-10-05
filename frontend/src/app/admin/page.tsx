"use client";

import Link from "next/link";
import { ManageList } from "./MangeList";
import { api } from "@/api/api";
import { LOAD_DATA_FROM_API } from "@/dataSource";
import { getAdminEvents, loadDataFromDrizzle } from "@/server/dbAccess";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";
import { ManageUserList } from "./MangeUserList";


export default function Admin() {

    function get_admin_events() {
        if (!LOAD_DATA_FROM_API) {
            return getAdminEvents();
        }
        return api.get_events_admin();
    }

    function get_all_events() {
        if (!LOAD_DATA_FROM_API) {
            return loadDataFromDrizzle();
        }
        return api.read();
    }

    function get_all_users() {
        if (!LOAD_DATA_FROM_API) {
            //return loadDataFromDrizzle();
            return Promise.resolve([]);
        }
        return api.listUsers();
    }

    const [tab, setTab] = useState("events");


    return <div className="w-full h-svh flex h-max-[100%] flex-col">
        <div className="w-full pt-4 pb-4 bg-slate-50 flex flex-row pl-10 pr-10 justify-between items-center">
            <h1 className="text-xl font-bold">Admin</h1>
            <Tabs defaultValue="events" className="w-fit" onValueChange={setTab} value={tab}>
                <TabsList>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="users">Nutzer</TabsTrigger>
                </TabsList>

            </Tabs>
            <Link href="/">Zurück</Link>
        </div>

        {
            tab === "events" && <>
                <ManageList loadData={get_admin_events} verifyable={true} headerDescription="Genehmige oder lösche Events" headerText="Ausstehende Event" />
                <ManageList loadData={get_all_events} verifyable={false} headerDescription="Lösche vorhandene Events" headerText="Aktive Events" />
            </>
        }

        {
            tab === "users" && <>
                <ManageUserList loadData={get_all_users} />
            </>
        }
    </div>
}

