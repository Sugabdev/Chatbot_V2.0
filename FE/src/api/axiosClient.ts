import axios from 'axios'
import { refreshToken } from '@/services/auth'
import type { AxiosInstance, AxiosResponse } from 'axios'

const AUTH_URL = import.meta.env.AUTH_API_URL
const CHAT_URL = import.meta.env.CHAT_API_URL

export const authInstance: AxiosInstance = axios.create({
    baseURL: AUTH_URL,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
    },
    timeout: 0,
})

// Refresh token interceptor
authInstance.interceptors.response.use(
    function (response: AxiosResponse) {
        return response
    },
    async function (error) {
        if (axios.isAxiosError(error)) {
            if (!error.config) {
                return Promise.reject(error)
            }

            const originalRequest = error.config as typeof error.config & {
                _retry?: boolean
            }

            if (originalRequest.url?.includes('auth/refresh')) {
                return Promise.reject(error)
            }

            if (error.response?.status === 401 && !originalRequest?._retry) {
                originalRequest._retry = true

                try {
                    await refreshToken()

                    return authInstance(originalRequest)
                } catch {
                    return Promise.reject(error)
                }
            }

            return Promise.reject(error)
        }
    }
)

export const chatInstance: AxiosInstance = axios.create({
    baseURL: CHAT_URL,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
    },
    timeout: 0,
})
