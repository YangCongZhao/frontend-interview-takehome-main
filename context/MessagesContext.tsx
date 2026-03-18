import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Ticket } from '@/types'

interface House {
  id: string
  name: string
}

const HOUSES: House[] = [
  { id: 'h1', name: 'Orchard House' },
  { id: 'h2', name: 'Marina Suite' },
  { id: 'h3', name: 'Sentosa Villa' },
]

interface MessagesContextValue {
  currentHouse: House | null
  setCurrentHouse: (house: House | null) => void
  activeTicketId: string | null
  setActiveTicketId: (id: string | null) => void
  tickets: Ticket[] | undefined
  unreadCount: number
}

const MessagesContext = createContext<MessagesContextValue | null>(null)
const fetcher = (url: string) => fetch(url).then(r => r.json())

export function MessagesProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [currentHouse, setCurrentHouse] = useState<House | null>(null)
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)
  const { data: tickets } = useSWR<Ticket[]>('/api/tickets', fetcher)
  const unreadCount = useMemo(
    () => tickets?.filter(ticket => ticket.unread).length ?? 0,
    [tickets]
  )

  useEffect(() => {
    const houseId = router.query.houseId as string
    const ticketId = router.query.ticketId as string
    const house = HOUSES.find(h => h.id === houseId) ?? null

    setActiveTicketId(ticketId ?? null)
    setCurrentHouse(house)
  }, [router.query.houseId, router.query.ticketId])

  return (
    <MessagesContext.Provider
      value={{
        currentHouse,
        setCurrentHouse,
        activeTicketId,
        setActiveTicketId,
        tickets,
        unreadCount,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessagesContext() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error('useMessagesContext must be used within MessagesProvider')
  return ctx
}

export { HOUSES }
export type { House, Ticket }
