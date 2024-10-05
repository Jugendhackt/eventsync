import { MapEvent } from '@/server/schema'
import { create } from 'zustand'

interface UserAccountState {
    event: MapEvent | null
    setEvent: (event: MapEvent | null) => void
  }

export const useAccount = create<UserAccountState>((set) => ({
    event: null,
    setEvent: (event:MapEvent | null) => {
        set((state) => ({ event: event}));
    }
  }))