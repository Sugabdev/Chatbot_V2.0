import { useEffect, useState } from 'react'
import { authMe } from '@/services/auth'

export function useAuth() {
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await authMe()
                setAuthenticated(data.authenticated)
            } catch {
                setAuthenticated(false)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    return {
        loading,
        authenticated,
    }
}
