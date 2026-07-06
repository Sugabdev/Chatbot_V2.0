import { Bot, LogIn, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/store/AuthStore'
import { logOutUser } from '@/services/auth'

export function Header() {
    const navigate = useNavigate()

    const user = useAuthStore((state) => state.user)

    const logout = useAuthStore((state) => state.logout)

    const handleClick = () => {
        if (user) {
            logOutUser()
            logout()
        }

        navigate('/login')
    }

    return (
        <header className="text-dark-neutral-200 flex w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-8 py-4">
            <div className="flex gap-x-2">
                <h1 className="text-2xl font-bold">OpenRouter - Chatbot</h1>
                <Bot />
            </div>
            <button
                onClick={handleClick}
                title={`${user ? 'Log Out' : 'Log In'}`}
            >
                {user ? (
                    <LogOut className="hover:text-dark-neutral-100 size-8 rounded-lg p-1 hover:bg-slate-700" />
                ) : (
                    <LogIn className="hover:text-dark-neutral-100 size-8 rounded-lg p-1 hover:bg-slate-700" />
                )}
            </button>
        </header>
    )
}
