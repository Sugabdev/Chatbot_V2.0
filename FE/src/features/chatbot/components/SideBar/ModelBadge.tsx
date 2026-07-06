import { Orbit } from 'lucide-react'

export function ModelBadge() {
    return (
        <div className="flex items-center gap-x-2">
            <div className="bg-dark-primary-500 rounded-xl p-2">
                <Orbit />
            </div>
            <div>
                <h1 className="text-2xl font-bold">OpenRouter</h1>
                <p className="text-dark-primary-500 px-1 text-sm">
                    openrouter/free
                </p>
            </div>
        </div>
    )
}
