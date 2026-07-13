import { useState, useEffect } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { Header } from '@/features/chatbot/components/Header'
import { Chat } from '@/features/chatbot/components/Chats/Chat'
import { NewChat } from '@/features/chatbot/components/Chats/NewChat'
import { useAuthStore } from '@/store/AuthStore'
import { useNavigate } from 'react-router'
import type { MessageState } from '@/types/chatbot'

export function UnloggedPage() {
    const [messages, setMessages] = useState<MessageState[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    const { send, lastMessage } = useSocket()

    const navigate = useNavigate()

    const user = useAuthStore((state) => state.user)

    // Navigation to /chat if signed in.
    useEffect(() => {
        if (user) {
            navigate('/chat')
        }
    }, [])

    // WebSocket onSend event handler
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

        send({
            type: 'continue_chat_free',
            message: [
                ...messages,
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        })
    }

    // WebSocket effect
    useEffect(() => {
        if (!lastMessage) return

        if ('chunk' in lastMessage) {
            setMessages((prev) => {
                const copy = [...prev]

                const last = copy[copy.length - 1]

                if (!last) return prev

                if (last.role !== 'assistant') return prev

                last.content += String(lastMessage.chunk)

                return copy
            })
        }

        if ('full_message' in lastMessage) {
            setMessages((prev) => {
                const copy = [...prev]
                const last = copy[copy.length - 1]

                if (!last) return prev

                last.content = lastMessage.full_message

                return copy
            })
        }

        if (
            'event_type' in lastMessage &&
            lastMessage.event_type === 'completed'
        ) {
            setIsGenerating(false)
        }
    }, [lastMessage])

    return (
        <main className="flex h-dvh min-h-0 flex-col items-center justify-center">
            <Header />
            {messages.length >= 1 ? (
                <Chat
                    isGenerating={isGenerating}
                    messages={messages}
                    onSend={handleSend}
                />
            ) : (
                <NewChat isGenerating={isGenerating} onSend={handleSend} />
            )}
        </main>
    )
}
