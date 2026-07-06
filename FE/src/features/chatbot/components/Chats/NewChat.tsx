import { Promptbox } from './Promptbox'

export function NewChat({
    isGenerating,
    onSend,
}: {
    isGenerating: boolean
    onSend: (prompt: string) => void
}) {
    return (
        <div className="bg-dark-neutral-900 text-dark-neutral-200 flex h-full w-full flex-col items-center justify-center gap-y-12 px-56">
            <h2 className="text-4xl font-semibold shadow-2xl">
                🫡 Ask for something ...
            </h2>
            <Promptbox isGenerating={isGenerating} onSend={onSend} />
        </div>
    )
}
