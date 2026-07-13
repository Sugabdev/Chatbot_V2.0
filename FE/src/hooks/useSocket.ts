import { useEffect, useRef, useState } from 'react'

type SocketMessage =
    | {
          chunk: string
      }
    | {
          full_message: string
      }
    | {
          event_type: 'chat_created'
          chat_id: string
      }
    | {
          event_type: 'completed'
      }

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL

export function useSocket() {
    const socketRef = useRef<WebSocket | null>(null)

    const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null)

    useEffect(() => {
        const socket = new WebSocket(WS_URL)

        socket.onopen = () => {
            console.log('SOCKET OPEN')
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setLastMessage(data)
        }

        socket.onclose = () => {
            console.log('SOCKET CLOSED')
        }

        socket.onerror = (error) => {
            console.log('SOCKET ERROR', error)
        }

        socketRef.current = socket

        return () => socket.close()
    }, [])

    const send = (payload: unknown) => {
        socketRef.current?.send(JSON.stringify(payload))
        console.log('conexión establecida')
    }

    return { send, lastMessage }
}
