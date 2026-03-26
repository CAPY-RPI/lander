import type { WheelEvent } from 'react'
import { useRef } from 'react'
import type { AppEvent } from '@/app/data/events'
import { useHorizontalWheelScroll } from '@/shared/hooks/useHorizontalWheelScroll'
import { EventCard } from './EventCard'
import styles from './EventRail.module.css'

type EventRailProps = {
  title: string
  events: AppEvent[]
  carouselLabel: string
}

function getEventKey(event: AppEvent) {
  return `${event.org_id}-${event.title}-${event.event_time ?? 'tba'}`
}

export function EventRail({ title, events, carouselLabel }: EventRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null)
  useHorizontalWheelScroll(railRef, { speed: 1, endCutoffPx: 0 })
  const headingId = `${title.replace(/\s+/g, '-')}-heading`

  const stopWheelPropagation = (event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <section className={styles.eventGroup} aria-labelledby={headingId}>
      <div className={styles.groupHeader}>
        <h2 className={styles.groupTitle} id={headingId}>
          {title}
        </h2>
      </div>

      <div
        ref={railRef}
        className={styles.carousel}
        aria-label={carouselLabel}
        onWheelCapture={stopWheelPropagation}
        tabIndex={0}
      >
        {events.map((event) => (
          <EventCard key={getEventKey(event)} event={event} />
        ))}
      </div>
    </section>
  )
}
