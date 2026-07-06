import { redirect } from 'react-router'
import { authMe } from '@/services/auth'

export async function authLoader() {
    try {
        return await authMe()
    } catch {
        throw redirect('/login')
    }
}
