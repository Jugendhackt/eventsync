import { MapEvent } from '@/server/schema'
import { create } from 'zustand'

interface LikesState {
    likes: string[]
    setLikes: (likes: string[]) => void
  }

export const useLiked = create<LikesState>((set) => ({
    likes: [],
    setLikes: (likes:string[]) => {
        set((state) => ({ likes: likes}));
    }
  }))