import { Promptbox } from './Promptbox'
import { Message } from './Message'
import type { MessageState } from '@/types/chatbot'

export function Chat({
    messages,
    isGenerating,
    onSend,
}: {
    messages: MessageState[]
    isGenerating: boolean
    onSend: (prompt: string) => void
}) {
    return (
        <div className="text-dark-neutral-200 flex h-full min-h-0 w-full flex-col overflow-y-auto bg-gray-950">
            <div className="flex flex-2 flex-col gap-y-16 px-8 py-16 md:px-72">
                {messages.map(({ content, role }, index) => {
                    return <Message key={index} content={content} role={role} />
                })}
            </div>

            <div className="sticky bottom-0 w-full flex-1 bg-gray-950 p-4 md:pb-32">
                <div className="md:px-50">
                    <Promptbox isGenerating={isGenerating} onSend={onSend} />
                </div>
            </div>
        </div>
    )
}
