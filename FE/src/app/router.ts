import { createBrowserRouter } from 'react-router'
import { UnloggedPage } from '@/features/chatbot/pages/UnloggedPage'
import { LoggedPage } from '@/features/chatbot/pages/LoggedPage'
import { LogginPage } from '@/features/auth/pages/LogginPage'
import { authLoader } from '@/services/loaders'

export const router = createBrowserRouter([
    {
        path: '/',
        children: [
            { index: true, Component: UnloggedPage },
            { path: 'login', Component: LogginPage },
        ],
    },
    {
        path: 'chat',
        loader: authLoader,
        children: [{ index: true, Component: LoggedPage }],
    },
])
