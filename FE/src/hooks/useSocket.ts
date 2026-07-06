import { useEffect, useRef, useState } from 'react'

type SocketMessage =
    | {
          chunk: string
      }
    | {
          event_type: 'chat_created'
          chat_id: string
      }
    | {
          event_type: 'completed'
      }

export function useSocket() {
    const socketRef = useRef<WebSocket | null>(null)

    const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null)

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/chats/`)

        socket.onopen = () => {
            console.log('SOCKET OPEN')
        }

        socket.onmessage = (event) => {
            console.log(event.data)
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
