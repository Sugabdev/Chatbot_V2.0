import { ModelBadge } from './ModelBadge'
import { ChatHistory } from '@/features/chatbot/components/SideBar/History/ChatHistory'
import { NewChatBtn } from './NewChatBtn'
import { UserBadge } from './Account/UserBadge'

export function SideBar({ handleNewChat }: { handleNewChat: () => void }) {
    return (
        <div className="text-dark-neutral-200 flex flex-col border-r border-slate-800 bg-slate-950 py-6">
            <div className="flex flex-col gap-y-8 px-4">
                <ModelBadge />
                <NewChatBtn onClick={handleNewChat} />
            </div>
            <div className="flex-2 px-4 py-6">
                <ChatHistory />
            </div>
            <hr className="text-slate-900" />
            <div className="px-4 py-6">
                <UserBadge />
            </div>
        </div>
    )
}
