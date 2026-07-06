import { authInstance } from '../api/axiosClient'
import type { UserBody, AuthMe } from '@/types/auth'

// Create new user.
export const createUser = async (body: UserBody) => {
    const { data } = await authInstance.post('users/', body)
    return data
}

// Delete an user.
export const deleteUser = async (userId: string) => {
    const { data } = await authInstance.delete(`${userId}`)
    return data
}

// Log in.
export const logInUser = async (body: UserBody) => {
    const { data } = await authInstance.post('auth/login/', body)
    return data
}

// Log out.
export const logOutUser = async () => {
    const { data } = await authInstance.post('auth/logout/')
    return data
}

// Auth me current user.
export const authMe = async (): Promise<AuthMe> => {
    const { data } = await authInstance.get('auth/me/')
    return data
}

// Refresh token
export const refreshToken = async () => {
    const { data } = await authInstance.post('auth/refresh/')
    return data
}
