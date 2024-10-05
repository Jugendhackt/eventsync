'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapEvent } from "@/server/schema"
import { Search } from "lucide-react"

export function SearchBar(props: {data: null | MapEvent[], setFilteredData: (data: MapEvent[]) => void}) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          className="pl-8"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          onChange={(e) => {
            if (!props.data) return;
            if(e.target.value === ''){
              props.setFilteredData(props.data);
              return;
            }
            const search = e.target.value.toLowerCase();
            const filteredData = props.data.filter((event) => {
                return Object.values(event).some((value) => {
                  if(typeof value === 'string' && value.toLowerCase().includes(search)){
                    return true;
                  }else if(typeof value === 'number' && value.toString().includes(search)){
                    return true;
                  }
                  return false;
                });
               
          })
          props.setFilteredData(filteredData);
          }}
        />
      </div>
    </div>
  )
}