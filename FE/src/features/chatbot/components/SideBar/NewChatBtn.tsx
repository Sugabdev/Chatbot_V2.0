import { MessageSquarePlus } from 'lucide-react'

export function NewChatBtn({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="bg-dark-primary-600 hover:bg-dark-primary-500 flex justify-center gap-x-2 rounded-2xl py-2 transition-all"
        >
            <MessageSquarePlus className="size-4" />
            <span className="text-sm font-semibold">New Chat</span>
        </button>
    )
}
