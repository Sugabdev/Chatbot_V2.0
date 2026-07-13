import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { createUser, logInUser } from '@/services/auth'
import { useAuthStore } from '@/store/AuthStore'
import { authMe } from '@/services/auth'
import type { UserBody } from '@/types/auth'

export function LogginPage() {
    const [registered, setRegistered] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState(null)

    const navigate = useNavigate()

    const login = useAuthStore((state) => state.login)

    // Sign In handler.
    const handleSignIn = async (body: UserBody) => {
        setLoading(true)
        setErrors(null)

        try {
            const res = await logInUser(body)

            const user = await authMe()

            if (res.authenticated) {
                login(user)
                navigate('/chat')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data

                setErrors(data)
            }
        } finally {
            setLoading(false)
        }
    }

    // Sign Up handler.
    const handleSignUp = async (body: UserBody) => {
        setLoading(true)
        setErrors(null)

        try {
            await createUser(body)

            const res = await logInUser(body)

            const user = await authMe()

            if (res.authenticated) {
                login(user)
                navigate('/chat')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data

                console.log('status', error.response?.status)

                setErrors(data)
            }
        } finally {
            setLoading(false)
        }
    }

    // Toggle Sign In/Up form.
    const toggleForm = () => {
        setErrors(null)
        setRegistered((prev) => !prev)
    }

    return (
        <main className="bg-dark-neutral-900 flex h-dvh min-h-0 flex-col items-center justify-center">
            {registered ? (
                <LoginForm
                    onSubmit={handleSignUp}
                    toggleForm={toggleForm}
                    registered={registered}
                    loading={loading}
                    errors={errors}
                />
            ) : (
                <LoginForm
                    onSubmit={handleSignIn}
                    toggleForm={toggleForm}
                    registered={registered}
                    loading={loading}
                    errors={errors}
                />
            )}
        </main>
    )
}
