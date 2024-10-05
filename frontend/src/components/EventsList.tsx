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
import { ExternalLink, Heart, MapPin, ScanBarcode } from "lucide-react"
import { TagsViewer } from "./tag-input"
import { useEventSelection } from "@/zustand/eventSelection"
import { useEffect, useRef, useState } from "react";
import { useAccount } from "@/zustand/userAccount";
import { api } from "@/api/api";

export const EventList = (props: { data: MapEvent[], likes: string[] | null }) => {

    return (
        <div className="mt-4 h-[95%] w-full overflow-hidden">
            <p className="pl-4 text-l font-bold">Event Liste</p>
            <div className="pr-4 pl-4 flex flex-col gap-4 mt-2 h-full overflow-scroll pb-20">
                {props.data.map((event) => <EventEntry key={event.event_id} event={event} likes={props.likes} />)}
                {
                    props.data.length == 0 &&
                    <p>Keine Events vorhanden</p>
                }
            </div>
        </div>
    )
}

const EventEntry = (props: { event: MapEvent, likes: string[] | null }) => {

    const { event, setEvent } = useEventSelection();

    const [clicked, setClicked] = useState(false)
    const [showMore, setShowMore] = useState(false)

    const myRef = useRef<HTMLDivElement>(null)
    const executeScroll = () => myRef.current!.scrollIntoView()

    const { username } = useAccount();

    const [liked, setLiked] = useState(props.likes?.includes(props.event.event_id) ?? false)

    useEffect(() => {
        setLiked(props.likes?.includes(props.event.event_id) ?? false)
        if (event?.event_id == props.event.event_id && !clicked) {
            executeScroll()
        }
        setClicked(false)
    }, [event])

    function like(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {


        api.likeEvent(props.event.event_id, !liked).then(() => {
            setLiked(!liked);
        });

        event.stopPropagation();

    }

    return (

        <div ref={myRef}>

            <Card onClick={() => { setEvent(props.event); setClicked(true); }} className={event?.event_id == props.event.event_id ? "bg-slate-200" : "" + " cursor-pointer"}>
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between items-start">
                        <div className="flex flex-row gap-2 items-center">
                            {props.event.name}

                        </div>
                        {<div onClick={(e) => { e.stopPropagation(); window.open("//" + props.event.website, '_blank'); }}>< ExternalLink /></div>}

                    </CardTitle>
                    <CardDescription>{props.event.author}</CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="flex flex-col gap-4 mb-4">
                        <p>{showMore ? props.event.description : props.event.description.slice(0, 175)}
                            {props.event.description.length > 175 && !showMore && "... "}
                            {props.event.description.length > 175 && <div className="cursor-pointer select-none text-zinc-600" onClick={(event) => { setShowMore(!showMore); event.stopPropagation(); }}>{showMore ? "Weniger Anzeigen" : "Mehr Anzeigen"}</div>}
                        </p>

                        <div className="flex flex-row gap-2">
                            <MapPin />
                            <span>{props.event.location}</span>
                        </div>

                    </div>

                    <div className="flex flex-row justify-between items-center">
                        {
                            props.event.tags &&
                            <TagsViewer tags={props.event.tags.split(',')} removeTag={null} />
                        }

                        {
                            username && <Heart className="cursor-pointer" color={liked ? "red" : "black"} fill={liked ? "red" : "transparent"} onClick={like} />
                        }
                    </div>
                </CardContent>


            </Card>
        </div>
    )
}

