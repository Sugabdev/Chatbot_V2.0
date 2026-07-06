import { useAuthStore } from '@/store/AuthStore'
import { getChats } from '@/services/chatbot'
import { ChatRecord } from '@/features/chatbot/components/SideBar/History/ChatRecord'

import { useQuery } from '@tanstack/react-query'

export function ChatHistory() {
    const user = useAuthStore((state) => state.user)

    // React query user's chats caché
    const chatsQuery = useQuery({
        queryKey: ['chats', user],
        queryFn: () => getChats(user!.id),
    })

    const { data: chats, isError, error } = chatsQuery

    if (isError) {
        console.error('Error en historial de chat: ', error)
        return <p>El historial de chats no pudo ser cargado.</p>
    }

    return (
        <div className="flex flex-col gap-y-2">
            <h1 className="text-dark-neutral-400 px-4 text-[10px] font-semibold">
                RECENT
            </h1>
            <div className="overflow-y-auto">
                {chats &&
                    chats.length > 0 &&
                    chats.map((chat) => {
                        return (
                            <ChatRecord
                                key={chat.id}
                                id={chat.id}
                                title={chat.title}
                            />
                        )
                    })}
            </div>
        </div>
    )
}
