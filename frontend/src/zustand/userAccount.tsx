"use client";
import { create } from 'zustand'

interface UserAccountState {
    username: string | null
    isAdmin: boolean
    setUsername: (username: string | null) => void
    setIsAdmin: (isAdmin: boolean) => void
  }

export const useAccount = create<UserAccountState>((set) => ({
    username: window?.localStorage.getItem('username') || null,
    isAdmin: (window?.localStorage.getItem('isAdmin')??"false") === 'true',
    setIsAdmin: (isAdmin: boolean) => {
        set((state) => ({ isAdmin: isAdmin, username: state.username }));
        if(isAdmin){
            window?.localStorage.setItem('isAdmin', isAdmin.toString());
        }
    },
    setUsername: (username: string | null) => {
        set((state) => ({ username: username, isAdmin: state.isAdmin }));
        if(username){
            window?.localStorage.setItem('username', username);
        }
    }
  }))