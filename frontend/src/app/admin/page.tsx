"use client";

import Link from "next/link";
import { ManageList } from "./MangeList";
import { api } from "@/api/api";


export default function Admin() {
   

    return <div className="w-full h-svh flex h-max-[100%] flex-col">
        <div className="w-full pt-4 pb-4 bg-slate-50 flex flex-row pl-10 pr-10 justify-between items-center">
            <h1 className="text-xl font-bold">Admin</h1>
            <Link href="/">Zurück</Link>
        </div>

    <ManageList loadData={api.get_events_admin} verifyable={true} headerDescription="Genehmige oder lösche Events" headerText="Ausstehende Event"/>
    <ManageList loadData={api.read} verifyable={false} headerDescription="Lösche vorhandene Events" headerText="Aktive Events"/>

       
    </div>
}

