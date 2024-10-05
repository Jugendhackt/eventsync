import { MapEvent } from "@/server/schema";
import { useEventSelection } from "@/zustand/eventSelection";
import { useEffect, useRef } from "react";
import { Marker, Popup } from 'react-leaflet';
import { greenIcon, redIcon } from "./Markers";


export const MapMarker = (props: { event: MapEvent }) => {

   
    const markerRef = useRef<typeof Marker>(null);
 
    const { event,setEvent } = useEventSelection();

    const handleClick = () => {
        setEvent(props.event);
    }

    console.log(event);

    return (
        <Marker icon={event===props.event?redIcon:greenIcon} key={props.event.id} position={[props.event.lat, props.event.lon]} eventHandlers={{
            click: handleClick,
            popupclose: () => {
                setEvent(null);
            }
        }}>
                  <Popup>
                    <div  className="w-full flex flex-col pl-10 pr-10 ">
                      <p className="text-xl font-bold">{props.event.name}</p>
                      <p>{props.event.location}</p>
                      <p>{props.event.hrtime}</p>
                    </div>
                  </Popup>
                </Marker>
    );
}