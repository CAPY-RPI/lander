import type { AppEvent } from '@/app/data/events'
import styles from './EventCard.module.css'

type EventCardProps = {
  event: AppEvent
}

const eventDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function formatEventTime(eventTime: string | null) {
  if (!eventTime) return 'TBA'
  return eventDateFormatter.format(new Date(eventTime))
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className={styles.eventCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{event.title}</h3>
        <p className={styles.cardDescription}>{event.description}</p>
      </div>

      <dl className={styles.metaList}>
        <div className={styles.metaRow}>
          <dt>Time</dt>
          <dd>{formatEventTime(event.event_time)}</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>Place</dt>
          <dd>{event.location}</dd>
        </div>
      </dl>
    </article>
  )
}
