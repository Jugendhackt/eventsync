import { MapEvent } from '@/server/schema'
import { create } from 'zustand'

interface UserAccountState {
    username: string | null
    isAdmin: boolean
    setUsername: (username: string | null) => void
    setIsAdmin: (isAdmin: boolean) => void
  }

export const useAccount = create<UserAccountState>((set) => ({
    username: window.localStorage.getItem('username') || null,
    isAdmin: false,
    
    setUsername: (username: string | null) => {
        set((state) => ({ username: username }));
        if(username){
            window.localStorage.setItem('username', username);
        }
    }
  }))