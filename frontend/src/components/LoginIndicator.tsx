"use client";

import { useAccount } from "@/zustand/userAccount";
import { Login } from "./Login";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const LoginIndicator = () => {
    const { username, setUsername } = useAccount();

    function logout () {
        setUsername(null);
        window.localStorage.removeItem('token');
    }

    if (username) {
       return <DropdownMenu>
            <DropdownMenuTrigger>{username}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Link href="/admin">Admin-Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>

        return <Link href="/admin">{username}</Link>
    } else {
        return <Login />
    }
}