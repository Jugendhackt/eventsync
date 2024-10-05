"use client";


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MapEvent, User } from "@/server/schema";
import { useEffect, useState } from "react";
import { api } from "@/api/api";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { TagsViewer } from "@/components/tag-input";
import { Button } from "@/components/ui/button";
import { LOAD_DATA_FROM_API } from "@/dataSource";
import { deleteEvent, verifyEvent } from "@/server/dbAccess";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";

export const ManageUserList = (props: { loadData: () => Promise<User[]> }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        props.loadData().then((data) => {
            setUsers(data);

            setLoading(false);
            setError(null);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
            setError(error);
        });

    }, []);

    return (
        <Card className="mt-4 mr-4 ml-4">
            <CardHeader>
                <CardTitle>Nutzer</CardTitle>
                <CardDescription>Ändere die Berechtigungen von Nutzern</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {
                    loading && <p>Loading...</p>
                }

                {
                    error && <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Ein Fehler ist aufgetreten
                        </AlertDescription>
                    </Alert>
                }

                {
                    !loading && !error && users.map((user) => <UserEntry user={user} />)
                }

                {
                    !loading && !error && users.length === 0 && <p>Keine Events vorhanden</p>
                }
            </CardContent>
        </Card>);


};

const UserEntry = (props: { user: User }) => {

    const [clicked, setClicked] = useState(props.user.is_admin ?? false);

    function change_admin(setAdmin: boolean) {
        setClicked(setAdmin);
        props.user.is_admin = setAdmin;
        if (!LOAD_DATA_FROM_API) {
            // deleteEvent(props.event);
        } else {
            api.changeAdmin(props.user.user_id, setAdmin);
          
        }
    }

    return (
        <Alert >
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-l font-bold">
                            {props.user.display_name}
                        </div>

                    </div>
                    <div className="w-2/3 flex flex-col gap-2">
                        {props.user.username}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="is_admin-mode">Admin</Label>
                        <Switch id="is_admin" checked={clicked} onCheckedChange={()=>change_admin(!clicked)} />
                    </div>
                </div>
            </div>
        </Alert>
    )
}