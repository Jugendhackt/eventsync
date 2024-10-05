"use client";

import Link from "next/link";
import { ManageList } from "./MangeList";
import { api } from "@/api/api";
import { LOAD_DATA_FROM_API } from "@/dataSource";
import { getAdminEvents, loadDataFromDrizzle } from "@/server/dbAccess";


export default function Admin() {

    function get_admin_events() {
        if(!LOAD_DATA_FROM_API) {
            return getAdminEvents();
        }
        return api.get_events_admin();
    }

    function get_all_events() {
        if(!LOAD_DATA_FROM_API) {
            return loadDataFromDrizzle();
        }
        return api.read();
    }
   

    return <div className="w-full h-svh flex h-max-[100%] flex-col">
        <div className="w-full pt-4 pb-4 bg-slate-50 flex flex-row pl-10 pr-10 justify-between items-center">
            <h1 className="text-xl font-bold">Admin</h1>
            <Link href="/">Zurück</Link>
        </div>

    <ManageList loadData={get_admin_events} verifyable={true} headerDescription="Genehmige oder lösche Events" headerText="Ausstehende Event"/>
    <ManageList loadData={get_all_events} verifyable={false} headerDescription="Lösche vorhandene Events" headerText="Aktive Events"/>

       
    </div>
}

