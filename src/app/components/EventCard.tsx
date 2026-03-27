import { motion } from 'framer-motion'
import type { AppEvent } from '@/app/data/events'
import { StaggerWords } from '@/shared/components/StaggerWords'
import { useRevealProgress } from '@/shared/hooks/useRevealProgress'
import styles from './EventCard.module.css'

type EventCardProps = {
  event: AppEvent
  onSelect?: (event: AppEvent) => void
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

export function EventCard({ event, onSelect }: EventCardProps) {
  const [cardRef, { centerDelta, progress }] = useRevealProgress<HTMLButtonElement>(0.45)
  const delayedProgress = Math.min(1, Math.max(0, progress))
  const side: 1 | -1 = centerDelta >= 0 ? 1 : -1
  const outX = side * 48
  const textInView = delayedProgress > 0.06
  const shouldShowLocation = event.location.trim().length > 0 && event.location !== event.title
  const style = {
    opacity: delayedProgress,
    x: outX * (1 - delayedProgress),
    y: 10 * (1 - delayedProgress),
    scale: 0.97 + (1 - 0.97) * delayedProgress,
    filter: `blur(${(3 * (1 - delayedProgress)).toFixed(2)}px)`,
  }

  return (
    <motion.button
      ref={cardRef}
      type="button"
      className={styles.eventCard}
      style={style}
      onClick={() => onSelect?.(event)}
      aria-label={`Open details for ${event.title}`}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <StaggerWords text={event.title} inView={textInView} baseDelay={0.05} stagger={0.03} />
        </h3>
        <p className={styles.cardDescription}>
          <StaggerWords
            text={event.description}
            inView={textInView}
            baseDelay={0.12}
            stagger={0.018}
          />
        </p>
      </div>

      <dl className={styles.metaList}>
        <div className={styles.metaRow}>
          <dt>Time</dt>
          <dd>
            <StaggerWords
              text={formatEventTime(event.event_time)}
              inView={textInView}
              baseDelay={0.18}
              stagger={0.022}
            />
          </dd>
        </div>
        {shouldShowLocation ? (
          <div className={styles.metaRow}>
            <dt>Place</dt>
            <dd>
              <StaggerWords
                text={event.location}
                inView={textInView}
                baseDelay={0.22}
                stagger={0.02}
              />
            </dd>
          </div>
        ) : null}
      </dl>
    </motion.button>
  )
}
