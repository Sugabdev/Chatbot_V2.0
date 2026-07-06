export interface Chat {
    created_at: string
    id: string
    last_message_at: string
    model: string
    title: string
    user: string
}

export interface Message {
    id: string
    chat: string
    role: 'user' | 'assistant'
    content: string
    created_at: string
}

export interface MessageState {
    role: 'user' | 'assistant'
    content: string
}
