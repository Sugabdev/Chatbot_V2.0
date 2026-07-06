import { chatInstance } from '@/api/axiosClient'
import type { Chat, Message } from '@/types/chatbot'

// Get user's chats
export const getChats = async (user_id: string): Promise<Chat[]> => {
    const { data } = await chatInstance.get(`${user_id}/`)
    return data
}

// Delete chat.
export const deleteChat = async (chat_id: string): Promise<void> => {
    const { data } = await chatInstance.delete(`${chat_id}/`)
    return data
}

// Get chat's messages
export const getMessages = async (chat_id: string): Promise<Message[]> => {
    const { data } = await chatInstance.get(`messages/${chat_id}`)
    return data
}
