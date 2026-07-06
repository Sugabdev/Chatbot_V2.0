import { create } from 'zustand'

interface User {
    id: string
    username: string
    email: string
}

interface AuthStore {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => {
    return {
        user: null,
        logout: () => set({ user: null }),
        login: (user) => set({ user: user }),
    }
})
