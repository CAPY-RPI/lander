import { useMemo, useState } from 'react'
import { EventDetailsModal } from '@/app/components/EventDetailsModal'
import { EventRail } from '@/app/components/EventRail'
import type { AppEvent } from '@/app/data/events'
import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import { PillButton } from '@/shared/components/PillButton'
import type { Event } from '@/shared/models/event'
import { useAuth } from '@/shared/context/AuthContext'
import { useEvents } from '@/shared/hooks/useEvents'
import { useUserEvents } from '@/shared/hooks/useUserEvents'
import styles from './EventsSection.module.css'

type EventsSectionProps = {
  refreshKey?: number
  onCreateEvent: () => void
  onEventsChanged: () => void
}

function toAppEvent(event: Event): AppEvent {
  return {
    eid: event.eid,
    title: event.location || 'Untitled event',
    location: event.location || 'Location to be announced',
    event_time: event.event_time,
    description: event.description || 'Event details coming soon.',
    org_id: event.eid,
  }
}

export function EventsSection({
  refreshKey = 0,
  onCreateEvent,
  onEventsChanged,
}: EventsSectionProps) {
  const { isAuthed, user } = useAuth()
  const { events, isLoading, error } = useEvents(20, 0, refreshKey)
  const {
    events: myEvents,
    isLoading: isLoadingMyEvents,
    error: myEventsError,
  } = useUserEvents(user?.uid, isAuthed, refreshKey)
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null)
  const registeredEventIds = useMemo(() => new Set(myEvents.map((event) => event.eid)), [myEvents])
  const recommendedEvents = events.map((event) => ({
    ...toAppEvent(event),
    isRegistered: registeredEventIds.has(event.eid),
  }))
  const myEventCards = myEvents.map((event) => ({
    ...toAppEvent(event),
    isRegistered: true,
  }))

  return (
    <AnimatedPanel className={`panel ${styles.eventsPanel}`} id="events" staggerIndex={2}>
      <div className={styles.panelHeader}>
        <PillButton
          type="button"
          subtle
          className={styles.createButton}
          onClick={onCreateEvent}
          aria-label="Create event"
          title="Create event"
        >
          +
        </PillButton>
      </div>
      {isLoading ? <p className={styles.status}>Loading events...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {isAuthed && isLoadingMyEvents ? (
        <p className={styles.status}>Loading your events...</p>
      ) : null}
      {isAuthed && myEventsError ? <p className={styles.error}>{myEventsError}</p> : null}
      {!isLoading && !error ? (
        <>
          {isAuthed ? (
            <EventRail
              title="my events"
              events={myEventCards}
              carouselLabel="My events carousel"
              onEventSelect={setSelectedEvent}
            />
          ) : null}
          <EventRail
            title="recommended"
            events={recommendedEvents}
            carouselLabel="Recommended events carousel"
            onEventSelect={setSelectedEvent}
          />
        </>
      ) : null}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        onRegistered={() => {
          onEventsChanged()
          setSelectedEvent((current) => (current ? { ...current, isRegistered: true } : current))
        }}
        onUnregistered={() => {
          onEventsChanged()
          setSelectedEvent((current) => (current ? { ...current, isRegistered: false } : current))
        }}
      />
    </AnimatedPanel>
  )
}
