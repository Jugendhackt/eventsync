"use client";
import { Marker, Popup } from 'react-leaflet';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Heart, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,

  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateNewForm } from '@/components/CreateNewForm';
import { api } from '@/api/api';
import { loadDataFromDrizzle } from '@/server/dbAccess';
import { MapEvent } from '@/server/schema';
import { LOAD_DATA_FROM_API } from '@/dataSource';
import { EventList } from '@/components/EventsList';
import { MapMarker } from '@/components/MapMarker';
import { AD } from '@/components/ad';
import { SearchBar } from '@/components/search-bar';
import { LoginIndicator } from '@/components/LoginIndicator';
import { useAccount } from '@/zustand/userAccount';
import { Toggle } from '@/components/ui/toggle';


export default function Home() {

  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [data, setData] = useState<MapEvent[]>([]);
  const [filteredData, setFilteredData] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);

  const {username} = useAccount();
  const [likes, setLikes] = useState<string[]>([]);
  const [sortLiked, setSortLiked] = useState(false);

  useEffect(() => {
    loadData();
  }, [username]);

  function loadData() {
    if(LOAD_DATA_FROM_API) {
      if(username) {
        api.getLikedEvents().then((data) => {
          setLikes(data);
        }).catch((error) => {
          console.error(error);
        });
      }


      api.read().then((data) => {
        console.log(data);
         setData(data);
         setFilteredData(data);
         setLoading(false);
         setError(null);
       }).catch((error) => {
         console.error(error);
         setLoading(false);
         setError(error);
       });
    }else{
      loadDataFromDrizzle().then((data) => {
        setData(data);
        setLoading(false);
        setFilteredData(data);
        console.log(data);
      });
    }
    setOpenNewDialog(false);
  }



  return (
    <div className="w-full h-svh flex h-max-[100%] flex-col">
      <div className="w-full pt-4 pb-4 bg-slate-50 flex flex-row pl-10 pr-10 justify-between items-center">
        <p className="text-xl font-bold">Jugendfinder</p>

        {
          loading ? <p>Loading...</p> : error ? <p>Ein Fehler ist aufgetreten</p> : 
            <div>Über {data.length}+ Events verfügbar</div>
        }

        <div className="flex flex-row gap-4 items-center">
          <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
            <DialogTrigger><Button onClick={()=>setOpenNewDialog(true)} variant="outline">Neuer Eintrag</Button></DialogTrigger>
            <DialogContent className='h-2/3 overflow-scroll'>
              <DialogHeader>
                <DialogTitle>Neuen Eintrag hinzufügen</DialogTitle>
                <DialogDescription>
                  <CreateNewForm reloadCallback={loadData} />
                </DialogDescription>
              </DialogHeader>
              
            </DialogContent>
          </Dialog>

          <LoginIndicator />


        </div>

      </div>
      <div className="flex flex-row w-screen h-full overflow-hidden justify-stretch">
        
        <div className='w-1/3 max-w-100 md:flex hidden flex-col'>
          <div className="w-full h-20 flex flex-row pl-4 pr-4 justify-between items-center gap-4">
            <SearchBar data={data} setFilteredData={setFilteredData}/>
          </div>
          <Separator />
          <EventList data={filteredData} likes={likes} />
          <AD />
        </div>
        <div className=" w-full">

          <Map position={[52.52476, 13.4041008]} zoom={13}>
            {
              filteredData.map((event) => (
                <MapMarker key={event.event_id} event={event} likes={likes} />
              ))
            }
          </Map>
         
        </div>

      </div>

    </div>
  );
}
