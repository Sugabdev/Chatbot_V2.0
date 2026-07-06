import { CircleUserRound } from 'lucide-react'
import { useAuthStore } from '@/store/AuthStore'

export function UserBadge() {
    const user = useAuthStore((state) => state.user)

    return (
        <div className="hover:text-dark-primary-100 flex items-center gap-x-4 rounded-2xl px-4 py-2 hover:bg-slate-900 hover:shadow-2xl">
            <CircleUserRound className="text-dark-neutral-200 size-10" />
            <div>
                <span className="text-sm font-semibold">{user?.username}</span>
                <small className="block">{user?.email}</small>
            </div>
        </div>
    )
}
