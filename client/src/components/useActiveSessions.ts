'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { API_URL } from '@/store/api'

// Лічильник активних вкладок через Socket.io
export default function useActiveSessions(): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const socket = io(API_URL)
    socket.on('activeSessions', setCount)
    return () => {
      socket.off('activeSessions', setCount)
      socket.disconnect()
    }
  }, [])

  return count
}
