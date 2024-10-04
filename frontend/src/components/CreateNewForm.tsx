"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { OpeenStreetMap, OpenStreetMapAutocomplete } from '@amraneze/osm-autocomplete';

import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TagInput } from "./tag-input";
import { MapEvent } from "@/server/schema";
import { addEventToDrizzle } from "@/server/dbAccess";
import { v4 as uuidv4 } from 'uuid';
import { LOAD_DATA_FROM_API } from "@/dataSource";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2).max(500),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    author: z.string().min(2).max(50),
    location: z.string().min(2).max(50),
    hrtime: z.string().max(50).optional(),
    time: z.date().optional(),
    deleteAfter: z.boolean(),
    tags: z.string().min(2).max(50),
    website: z.string().min(2).max(50),
})

export function CreateNewForm(props: {reloadCallback: () => void}) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            lat: 52.52476,
            lon: 3.4041008,
            author: "",
            location: "",
            hrtime: "",
            time: new Date(),
            deleteAfter: false,
            website: "",
            tags: "",

        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        if(LOAD_DATA_FROM_API) {
            //TODO: Implement API call
        }else{
            addEventToDrizzle({
                ...values,
                createTime: new Date().toISOString(),
                id: uuidv4(),
                hrtime: values.hrtime || null,
                time: values.time?.toISOString() || null
            });
        }
       

        props.reloadCallback();
        console.log(values)
    }

    const [oneTimeEvent, setOneTimeEvent] = useState(false);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event-Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Jugendtreff 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Beschreibung</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Diesjähriges Jugend Event im Jugendkulturzentrum" {...field} />
                            </FormControl>
                        </FormItem>

                    )}
                />

                <FormField
                    control={form.control}
                    name="lon"
                    render={(fieldLon) => {

                        return <FormField
                        control={form.control}
                        name="lat"
                        render={(fieldLat) => {

                            return <FormItem>
                            <FormLabel>Adresse</FormLabel>
                            <FormControl>
                            <OpenStreetMapAutocomplete value={null} onChange={(data) => {
                                console.log(data);
                                fieldLon.field.onChange({target: {value: parseFloat(data?.lon??"0")}});
                                fieldLat.field.onChange({target: {value: parseFloat(data?.lat??"0")}});
                            }}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
    
                        }}
                    />

                    }}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ortsbeschreibung</FormLabel>
                            <FormControl>
                                <Input placeholder="Oberer Stock im Jugendkulturhaus" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Herausgeber</FormLabel>
                            <FormControl>
                                <Input placeholder="Jugendkulturwerk" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <FormField
                    control={form.control}
                    name="deleteAfter"
                    render={({ field }) => (
                        <FormItem className="">
                            <FormControl>
                                <div className="flex flex-row gap-2">
                                    <Checkbox id="oneTimeEvent" checked={field.value} onCheckedChange={(newState) => {
                                        field.onChange(newState);
                                        setOneTimeEvent(newState as boolean);
                                    }} />
                                    <label
                                        htmlFor="oneTimeEvent"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                                    >
                                        Einmal Event
                                    </label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />

                {
                    !oneTimeEvent &&
                    <FormField
                        control={form.control}
                        name="hrtime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Zeitpunkt</FormLabel>
                                <FormControl>
                                    <Input placeholder="18.03.2024 14:00 Uhr" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />

                }

                {
                    oneTimeEvent &&
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2">
                                <FormLabel>Datum</FormLabel>
                                <FormControl>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value??new Date()}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                }

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <TagInput onTagsChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input placeholder="mywebsite.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />

                <Button type="submit" className='mt-2 self-end'>Speichern</Button>

            </form>
        </Form>
    )

}