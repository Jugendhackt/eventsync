import { MapEvent } from '@/server/schema'
import { create } from 'zustand'

interface EventSelectionState {
    event: MapEvent | null
    setEvent: (event: MapEvent | null) => void
  }

export const useEventSelection = create<EventSelectionState>((set) => ({
    event: null,
    setEvent: (event:MapEvent | null) => {
        set((state) => ({ event: event}));
        console.log("test")
    }
  }))