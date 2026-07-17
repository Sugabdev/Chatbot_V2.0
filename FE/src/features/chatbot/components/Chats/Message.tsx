import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function Message({ content, role }: { content: string; role: string }) {
    const isUser = role === 'user'

    if (role === 'assistant' && content === '') {
        return (
            <div className="flex items-center gap-2">
                <span className="animate-pulse font-bold">Thinking ...</span>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-3">
            <div
                className={`prose prose-invert col-span-2 max-w-none rounded-2xl p-2 md:p-4 ${
                    isUser
                        ? 'bg-dark-neutral-900 md:text-md col-start-2 text-sm shadow-lg'
                        : 'col-span-3'
                } `}
            >
                <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            </div>
        </div>
    )
}
