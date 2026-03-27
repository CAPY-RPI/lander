import { useEffect, useState } from 'react'
import type { Event } from '@/shared/models/event'
import { listUserEvents } from '@/shared/services/eventService'

type UseUserEventsResult = {
  events: Event[]
  isLoading: boolean
  error: string | null
}

/**
 * Loads the current authenticated user's registered events when a UID is available.
 */
export function useUserEvents(
  uid: string | undefined,
  enabled = true,
  refreshKey = 0,
): UseUserEventsResult {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    if (!enabled || !uid) {
      setEvents([])
      setIsLoading(false)
      setError(null)
      return () => {
        isCancelled = true
      }
    }

    const resolvedUid = uid

    async function loadEvents() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await listUserEvents(resolvedUid)
        if (!isCancelled) {
          setEvents(data)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Could not load your events.')
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
  }, [enabled, uid, refreshKey])

  return { events, isLoading, error }
}
