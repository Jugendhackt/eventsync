"use client";
import { MapEvent } from "@/server/schema"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { TagsViewer } from "./tag-input"
import { useEventSelection } from "@/zustand/eventSelection"
import { useEffect, useRef, useState } from "react";

export const EventList = (props: { data: MapEvent[] }) => {
    return (
        <div className="mt-4 h-[95%] w-full overflow-hidden">
            <p className="pl-4 text-l font-bold">Event Liste</p>
            <div className="pr-4 pl-4 flex flex-col gap-4 mt-2 h-full overflow-scroll pb-20">
                {props.data.map((event) => <EventEntry key={event.id} event={event} />)}
            </div>
        </div>
    )
}

const EventEntry = (props: { event: MapEvent }) => {

    const { event, setEvent } = useEventSelection();

    const [clicked, setClicked] = useState(false)

    const myRef = useRef<HTMLDivElement>(null)
    const executeScroll = () => myRef.current!.scrollIntoView()

    useEffect(() => {
        if (event?.id == props.event.id && !clicked) {
            executeScroll()
        }
        setClicked(false)
    }, [event])
    return (

        <div ref={myRef}>

            <Card onClick={() => {setEvent(props.event); setClicked(true);}} className={event?.id == props.event.id ? "bg-slate-200" : "" + " cursor-pointer"}>
                <CardHeader>
                    <CardTitle>{props.event.name}</CardTitle>
                    <CardDescription>{props.event.author}</CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="flex flex-col gap-4">
                        <p>{props.event.description}</p>

                        <div className="flex flex-row gap-2">
                            <MapPin />
                            <span>{props.event.location}</span>
                        </div>
                       {
                            props.event.tags &&
                            <TagsViewer tags={props.event.tags.split(',')} removeTag={null} />

                       } 
                    </div>
                </CardContent>

            </Card>
        </div>
    )
}

