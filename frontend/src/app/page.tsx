"use client";
import { Marker, Popup } from 'react-leaflet';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,

  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateNewForm } from '@/components/CreateNewForm';
import { api } from '@/api/api';
import { MapEvent } from '@/models/event';


export default function Home() {

  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [data, setData] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.read().then((data) => {

      setData(data);
      setLoading(false);
      setError(null);
    }).catch((error) => {
      console.error(error);
      setLoading(false);
      setError(error);
    });


   // setData(JSON.parse(window.localStorage.getItem('data') ?? '[]') satisfies MapEvent[]);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full h-20 bg-slate-50 flex flex-row pl-10 pr-10 justify-between items-center">
        <p className="text-xl font-bold">Jugendfinder</p>

        {
          loading ? <p>Loading...</p> : error ? <p>Ein Fehler ist aufgetreten</p> : (
            <></>
          )
        }

        <div>
          <Dialog>
            <DialogTrigger><Button variant="outline">Neuer Eintrag</Button></DialogTrigger>
            <DialogContent className='h-2/3 overflow-scroll'>
              <DialogHeader>
                <DialogTitle>Neuen Eintrag hinzufügen</DialogTitle>
                <DialogDescription>
                  <CreateNewForm />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" className='mt-2'>Speichern</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>


        </div>

      </div>
      <div className="flex flex-row w-screen h-full justify-stretch">
        <div className='w-1/3 max-w-100 md:flex hidden flex-col'>
          <div className="w-full h-20 flex flex-row pl-4 pr-4 justify-between items-center">
            <div className="flex flex-row gap-3 items-center"> <SlidersHorizontal />
              <p className="text-xl font-bold">Filter</p>
            </div>

            <Button variant="outline">Filter zurücksetzen</Button>

          </div>
          <Separator />
        </div>
        <div className=" w-full">

          <Map position={[52.52476, 13.4041008]} zoom={13}>
            {
              data.map((event) => (
                <Marker position={[52.52476, 13.4041008]}>
                  <Popup>
                    <div key={event.id} className="w-full h-20 bg-slate-50 flex flex-row pl-10 pr-10 justify-between items-center">
                      <p className="text-xl font-bold">{event.name}</p>
                      <p>{event.location}</p>
                    </div>
                  </Popup>
                </Marker>

              ))
            }
          </Map>
        </div>

      </div>

    </div>
  );
}
