import { useEffect } from 'react'
import { authMe } from '@/services/auth'
import { useAuthStore } from '@/store/AuthStore'
import { router } from '@/app/router'
import { RouterProvider } from 'react-router'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function App() {
    const login = useAuthStore((state) => state.login)
    const logout = useAuthStore((state) => state.logout)

    useEffect(() => {
        authMe()
            .then((user) => login(user))
            .catch(() => logout())
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}
