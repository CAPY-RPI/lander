import { useEffect, useState } from 'react'
import type { Event } from '@/shared/models/event'
import { listEvents } from '@/shared/services/eventService'

type UseEventsResult = {
  events: Event[]
  isLoading: boolean
  error: string | null
}

/**
 * Fetches the current events list for the landing page and exposes basic loading state.
 */
export function useEvents(limit = 20, offset = 0, refreshKey = 0): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadEvents() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await listEvents(limit, offset)
        if (!isCancelled) {
          setEvents(data)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Could not load events.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      isCancelled = true
    }
  }, [limit, offset, refreshKey])

  return { events, isLoading, error }
}
