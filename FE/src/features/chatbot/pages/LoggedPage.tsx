import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSocket } from '@/hooks/useSocket'

import { useActiveChatStore } from '@/store/ActiveChatStore'
import { getMessages } from '@/services/chatbot'

import { Header } from '@/features/chatbot/components/Header'
import { SideBar } from '../components/SideBar/SideBar'
import { Chat } from '@/features/chatbot/components/Chats/Chat'
import { NewChat } from '@/features/chatbot/components/Chats/NewChat'

import type { MessageState } from '@/types/chatbot'

export function LoggedPage() {
    const [messages, setMessages] = useState<MessageState[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    const pendingChatId = useRef<string | null>(null)

    const activeChatId = useActiveChatStore((state) => state.id)
    const setActiveChat = useActiveChatStore((state) => state.setActiveChat)

    const queryClient = useQueryClient()

    const { send, lastMessage } = useSocket()

    // React query messages caché
    const { data } = useQuery({
        queryKey: ['messages', activeChatId],
        queryFn: () => getMessages(activeChatId!),
        enabled: activeChatId !== null,
    })

    // WebSocket onSend handler
    const handleSend = (prompt: string) => {
        if (isGenerating) return

        setIsGenerating(true)

        setMessages((prev) => [
            ...prev,
            {
                role: 'user',
                content: prompt,
            },
            {
                role: 'assistant',
                content: '',
            },
        ])

        if (activeChatId) {
            send({
                type: 'continue_chat_auth',
                chat_id: activeChatId,
                message: prompt,
            })
        } else {
            send({
                type: 'start_chat',
                message: prompt,
            })
        }
    }

    // New chat button handler
    const handleNewChat = () => {
        setActiveChat(null)
        setMessages([])
    }

    // React query effect.
    useEffect(() => {
        if (!data) return

        const messageData = data.map((message) => ({
            role: message.role,
            content: message.content,
        }))

        setMessages(messageData)
    }, [data])

    // WebSocket effect
    useEffect(() => {
        if (!lastMessage) return

        // chunks
        if ('chunk' in lastMessage) {
            setMessages((prev) => {
                const copy = [...prev]

                const last = copy[copy.length - 1]

                if (!last) return prev

                last.content += lastMessage.chunk

                return copy
            })

            return
        }

        // Events types
        if (!('event_type' in lastMessage)) return

        switch (lastMessage.event_type) {
            case 'chat_created':
                // Solo guardamos el id.
                pendingChatId.current = lastMessage.chat_id
                break

            case 'completed':
                setIsGenerating(false)

                if (pendingChatId.current) {
                    setActiveChat(pendingChatId.current)

                    queryClient.invalidateQueries({
                        queryKey: ['messages', pendingChatId.current],
                    })

                    queryClient.invalidateQueries({
                        queryKey: ['chats'],
                    })

                    pendingChatId.current = null
                }

                break

            default:
                console.warn('Unhandled websocket event')
        }
    }, [lastMessage])

    return (
        <main className="grid h-dvh min-h-0 grid-rows-[60px_1fr]">
            <Header />
            <div className="grid grid-cols-[250px_1fr] overflow-hidden">
                <SideBar handleNewChat={handleNewChat} />
                {messages.length > 0 ? (
                    <Chat
                        messages={messages}
                        isGenerating={isGenerating}
                        onSend={handleSend}
                    />
                ) : (
                    <NewChat isGenerating={isGenerating} onSend={handleSend} />
                )}
            </div>
        </main>
    )
}
