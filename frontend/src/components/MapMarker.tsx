"use client";
import { MapEvent } from "@/server/schema";
import { useEventSelection } from "@/zustand/eventSelection";
import { Marker, Popup } from 'react-leaflet';
import { blueIcon, greenIcon, redIcon } from "./Markers";
import { useLiked } from "@/zustand/likes";


 const MapMarker = (props: { event: MapEvent}) => {


  const { event, setEvent } = useEventSelection();
  const {likes} = useLiked();

  const handleClick = () => {
    setEvent(props.event);
  }


  return (
    <Marker icon={event === props.event ? blueIcon : (likes.includes(props.event.event_id??"")?redIcon:greenIcon)} key={props.event.event_id} position={[props.event.lat, props.event.lon]} eventHandlers={{
      click: handleClick,
      popupclose: () => {
        setEvent(null);
      }
    }}>
      <Popup>
        <div className="w-full flex flex-col pl-10 pr-10 ">
          <p className="text-xl font-bold">{props.event.name}</p>
          <p>{props.event.location}</p>
          <p>{props.event.hrtime}</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default MapMarker;