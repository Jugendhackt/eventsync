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
    return (



        <Card>
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
               <TagsViewer tags={props.event.tags.split(',')} removeTag={null} />
                </div>
            </CardContent>
        
        </Card>
    )
}

