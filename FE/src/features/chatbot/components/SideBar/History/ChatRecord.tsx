import { Trash2 } from 'lucide-react'
import { useActiveChatStore } from '@/store/ActiveChatStore'
import { deleteChat } from '@/services/chatbot'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function ChatRecord({
    id,
    title,
}: {
    id: string
    title: string | null
}) {
    const activeChatId = useActiveChatStore((state) => state.id)
    const setActiveChat = useActiveChatStore((state) => state.setActiveChat)

    const isActive = activeChatId === id

    const queryClient = useQueryClient()

    // React query delete chat mutation.
    const deleteMutation = useMutation({
        mutationFn: (chat_id: string) => deleteChat(chat_id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['messages'],
            })
            queryClient.invalidateQueries({
                queryKey: ['chats'],
            })
        },
    })

    // Active chat handler
    const handleActiveChat = () => {
        setActiveChat(id)
    }

    // Delete chat handler
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        deleteMutation.mutate(id)
    }

    return (
        <li
            className={`flex items-baseline gap-x-2 rounded-md px-4 py-2 text-sm ${
                isActive
                    ? 'bg-dark-primary-900/50 border-dark-primary-600 border-l-4'
                    : 'hover:bg-slate-900'
            }`}
            onClick={handleActiveChat}
        >
            <h1
                className={`flex-2 truncate ${
                    isActive ? 'text-dark-primary-400' : 'text-dark-neutral-400'
                }`}
                title={`${title}`}
            >
                {title}
            </h1>

            <button onClick={handleDelete}>
                <Trash2 className="size-4 hover:text-red-700" />
            </button>
        </li>
    )
}
