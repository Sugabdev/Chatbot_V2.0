import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Spinner } from '@/ui/Spinner'

export function Promptbox({
    isGenerating,
    onSend,
}: {
    isGenerating: boolean
    onSend: (prompt: string) => void
}) {
    const [prompt, setPrompt] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        onSend(prompt)

        setPrompt('')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-[1fr_50px] rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl md:w-full"
        >
            <input
                className="px-8 outline-none"
                placeholder="Type your message or ask for analysis..."
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />

            {isGenerating ? (
                <Spinner />
            ) : (
                <button
                    type="submit"
                    className="bg-dark-primary-600 hover:bg-dark-primary-500 active:bg-dark-primary-700 flex size-10 items-center justify-center rounded-xl transition-all"
                >
                    <SendHorizontal />
                </button>
            )}
        </form>
    )
}
