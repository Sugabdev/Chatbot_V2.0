import type { UserBody } from '@/types/auth'
import { Bot, Eye } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export function LoginForm({
    onSubmit,
    toggleForm,
    registered,
}: {
    onSubmit: (body: UserBody) => void
    toggleForm: () => void
    registered: boolean
}) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [password, setPassword] = useState<'password' | 'text'>('password')

    const navigate = useNavigate()

    const passwordMatch =
        !registered || formData.password === formData.confirmPassword

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!passwordMatch) {
            alert("Password doesn't match, try again!")
            return
        }

        const body: UserBody = registered
            ? {
                  username: formData.username,
                  email: formData.email,
                  password: formData.password,
              }
            : {
                  username: formData.username,
                  password: formData.password,
              }

        onSubmit(body)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="text-dark-neutral-200 bg-dark-neutral-800 border-dark-neutral-700 flex flex-col gap-y-4 rounded-xl border p-8"
        >
            <header className="flex flex-col items-center justify-center gap-y-1">
                <Bot
                    className={`${registered ? 'bg-dark-tertiary-500' : 'bg-dark-primary-500'} size-12 rounded-lg p-2`}
                />
                <h1 className="text-xl font-semibold">
                    {registered ? 'Get Started' : 'Welcome Back'}
                </h1>
                <small className="text-dark-neutral-400">
                    {registered
                        ? 'Create your account today'
                        : 'Sign in to continue your session'}
                </small>
            </header>

            <label className="text-[10px]">
                USERNAME
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="user"
                    className="bg-dark-neutral-200 text-dark-neutral-900 mt-1 block w-full rounded-lg px-4 py-2 text-sm outline-none"
                />
            </label>

            {registered && (
                <label className="text-[10px]">
                    EMAIL ADDRESS
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="user@email.com"
                        className="bg-dark-neutral-200 text-dark-neutral-900 mt-1 block w-full rounded-lg px-4 py-2 text-sm outline-none"
                    />
                </label>
            )}

            <label className="text-[10px]">
                PASSWORD
                <div className="bg-dark-neutral-200 mt-1 flex w-full items-center rounded-lg px-4 py-2">
                    <input
                        type={password}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="text-dark-neutral-900 block flex-1 text-sm outline-none"
                    />

                    <Eye
                        onClick={() =>
                            setPassword((prev) =>
                                prev === 'password' ? 'text' : 'password'
                            )
                        }
                        className="text-dark-neutral-900 hover:text-dark-primary-600 size-4 cursor-pointer"
                    />
                </div>
            </label>

            {registered && (
                <label className="text-[10px]">
                    CONFIRM PASSWORD
                    <div className="bg-dark-neutral-200 mt-1 flex w-full items-center rounded-lg px-4 py-2">
                        <input
                            type={password}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="text-dark-neutral-900 block flex-1 text-sm outline-none"
                        />

                        <Eye
                            onClick={() =>
                                setPassword((prev) =>
                                    prev === 'password' ? 'text' : 'password'
                                )
                            }
                            className="text-dark-neutral-900 hover:text-dark-primary-600 size-4 cursor-pointer"
                        />
                    </div>
                    {!passwordMatch && (
                        <small className="text-red-700">
                            Password doesn't match!
                        </small>
                    )}
                </label>
            )}

            <button
                type="submit"
                className={`${registered ? 'bg-dark-tertiary-500 active:bg-dark-tertiary-700 hover:bg-dark-tertiary-400' : 'bg-dark-primary-500 active:bg-dark-primary-700 hover:bg-dark-primary-400'} w-full cursor-pointer rounded-lg py-2 font-semibold`}
            >
                {registered ? 'Create Account' : 'Sign In'}
            </button>

            <div className="text-dark-neutral-400 flex gap-x-2 text-sm">
                <span>
                    {registered
                        ? 'Already have an account?'
                        : "Don't have an account?"}
                </span>

                <span
                    className={`${registered ? 'text-dark-tertiary-500 hover:text-dark-tertiary-300' : 'text-dark-primary-400 hover:text-dark-primary-300'} cursor-pointer`}
                    onClick={toggleForm}
                >
                    {registered ? 'Sign In' : 'Sign Up'}
                </span>
            </div>

            <div className="mx-auto">
                <p className="text-dark-neutral-400 flex gap-x-2 text-sm">
                    Try for
                    <span
                        className="text-dark-primary-400 hover:text-dark-primary-300 cursor-pointer font-bold"
                        onClick={() => navigate('/')}
                    >
                        FREE
                    </span>
                </p>
            </div>
        </form>
    )
}
