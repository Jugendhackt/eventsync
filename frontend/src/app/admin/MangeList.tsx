"use client";


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MapEvent } from "@/server/schema";
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

export const ManageList = (props: {loadData: ()=>Promise<MapEvent[]>, verifyable: boolean, headerText:string, headerDescription: string}) => {
    const [events, setEvents] = useState<MapEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        props.loadData().then((data) => {
            setEvents(data);

            setLoading(false);
            setError(null);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
            setError(error);
        });

    }, []);

return(
    <Card className="mt-4 mr-4 ml-4">
    <CardHeader>
        <CardTitle>{props.headerText}</CardTitle>
        <CardDescription>{props.headerDescription}</CardDescription>
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
            !loading && !error && events.map((event) => <EventEntry verifyable={props.verifyable} key={event.event_id} event={event} onProcessed={()=>{
                setEvents(events.filter(e=>e.event_id!==event.event_id));
            }} />)
        }

        {
            !loading && !error && events.length === 0 && <p>Keine Events vorhanden</p>
        }
    </CardContent>
</Card>);


};

const EventEntry = (props: { event: MapEvent,verifyable: boolean, onProcessed: ()=>void }) => {
    function verify_event() {
        if(!LOAD_DATA_FROM_API) {
            verifyEvent(props.event);
        }else{
            api.verify_event(props.event.event_id);

        }
        props.onProcessed();
    }

    function delete_event() {
        if(!LOAD_DATA_FROM_API) {
            deleteEvent(props.event);
        }else{
            api.delete_event(props.event.event_id);
        }
        props.onProcessed();
    }

    return (
        <Alert >
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-l font-bold">
                            {props.event.name}
                        </div>
                        <TagsViewer tags={props.event.tags.split(',')} removeTag={null} />

                    </div>
                    <div className="w-2/3 flex flex-col gap-2">
                        {props.event.description}
                        <div>Website: {props.event.website}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    { props.verifyable &&
                        <Button onClick={verify_event} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Genehmigen</Button>
                    }
                    <Button onClick={delete_event} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Löschen</Button>
                </div>
            </div>
        </Alert>
    )
}