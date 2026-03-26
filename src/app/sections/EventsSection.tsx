import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import styles from './EventsSection.module.css'

export function EventsSection() {
  return (
    <AnimatedPanel className={`panel ${styles.eventsPanel}`} id="events" staggerIndex={2}>
      <div>
        <h1 className={styles.title}>events</h1>
        <p>
          Discover what's happening on campus. Whether you're motivated by friends, food, or both.
        </p>
      </div>
    </AnimatedPanel>
  )
}
