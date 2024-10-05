"use client";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useEventSelection } from "@/zustand/eventSelection";
import { useEffect, useRef, useState } from "react";
import { Map as LMap } from "leaflet";

export default function Map(props: any) {
  const { position, zoom, markers } = props
  const [map, setMap] = useState<LMap|null>(null);



  const {event, setEvent} = useEventSelection();

  useEffect(() => {
    if(event){
      map!.flyTo([event.lat, event.lon], 13);
    }
  }, [event]);


  return <MapContainer ref={setMap} className="w-full h-full z-10" center={position} zoom={zoom} >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
      props.children
    }
  </MapContainer>
}