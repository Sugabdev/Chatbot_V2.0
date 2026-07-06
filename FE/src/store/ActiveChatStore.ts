import { create } from 'zustand'

interface ActiveChat {
    id: string | null
    setActiveChat: (id: string | null) => void
}

export const useActiveChatStore = create<ActiveChat>((set) => ({
    id: null,
    setActiveChat: (id) => set({ id: id }),
}))
