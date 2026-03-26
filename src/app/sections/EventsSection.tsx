import { EventRail } from '@/app/components/EventRail'
import { myEvents, recommendedEvents } from '@/app/data/events'
import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import { useAuth } from '@/shared/context/AuthContext'
import styles from './EventsSection.module.css'

export function EventsSection() {
  const { isAuthed } = useAuth()

  return (
    <AnimatedPanel className={`panel ${styles.eventsPanel}`} id="events" staggerIndex={2}>
      {isAuthed ? (
        <EventRail title="my events" events={myEvents} carouselLabel="My events carousel" />
      ) : null}

      <EventRail
        title="recommended"
        events={recommendedEvents}
        carouselLabel="Recommended events carousel"
      />
    </AnimatedPanel>
  )
}
