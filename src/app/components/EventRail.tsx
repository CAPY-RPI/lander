import { useEffect, useState, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import type { AppEvent } from '@/app/data/events'
import { useSafariHorizontalRailFallback } from '@/shared/hooks/useSafariHorizontalRailFallback'
import { EventCard } from './EventCard'
import styles from './EventRail.module.css'

type EventRailProps = {
  title: string
  events: AppEvent[]
  carouselLabel: string
  onEventSelect?: (event: AppEvent) => void
}

function getEventKey(event: AppEvent) {
  return `${event.eid}-${event.title}-${event.event_time ?? 'tba'}`
}

export function EventRail({ title, events, carouselLabel, onEventSelect }: EventRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null)
  const headingId = `${title.replace(/\s+/g, '-')}-heading`
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)
  const hasEvents = events.length > 0

  useSafariHorizontalRailFallback(railRef)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const updateScrollState = () => {
      const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth)
      setCanScrollBack(rail.scrollLeft > 4)
      setCanScrollForward(rail.scrollLeft < maxScrollLeft - 4)
    }

    updateScrollState()
    rail.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      rail.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [events.length])

  const scrollRail = (direction: 'back' | 'forward') => {
    const rail = railRef.current
    if (!rail) return

    const firstCard = rail.firstElementChild as HTMLElement | null
    const cardWidth = firstCard?.getBoundingClientRect().width ?? rail.clientWidth * 0.82
    const computedRailStyle = window.getComputedStyle(rail)
    const gap = Number.parseFloat(computedRailStyle.columnGap || computedRailStyle.gap || '0') || 0
    const delta = cardWidth + gap

    rail.scrollBy({
      left: direction === 'forward' ? delta : -delta,
      behavior: 'smooth',
    })
  }

  const onRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollRail('forward')
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollRail('back')
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      railRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    if (event.key === 'End') {
      const rail = railRef.current
      if (!rail) return

      event.preventDefault()
      rail.scrollTo({ left: rail.scrollWidth - rail.clientWidth, behavior: 'smooth' })
    }
  }

  return (
    <section className={styles.eventGroup} aria-labelledby={headingId}>
      <div className={styles.groupHeader}>
        <h2 className={styles.groupTitle} id={headingId}>
          {title}
        </h2>
      </div>

      {hasEvents ? (
        <div className={styles.railShell}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => scrollRail('back')}
            aria-label={`Scroll ${title} backward`}
            disabled={!canScrollBack}
          >
            <span aria-hidden="true">&larr;</span>
          </button>

          <div
            ref={railRef}
            className={styles.carousel}
            data-reveal-scroller
            data-native-horizontal-scroll
            aria-label={carouselLabel}
            tabIndex={0}
            data-can-scroll-back={canScrollBack}
            data-can-scroll-forward={canScrollForward}
            onKeyDown={onRailKeyDown}
          >
            {events.map((event) => (
              <EventCard key={getEventKey(event)} event={event} onSelect={onEventSelect} />
            ))}
          </div>

          <button
            type="button"
            className={styles.controlButton}
            onClick={() => scrollRail('forward')}
            aria-label={`Scroll ${title} forward`}
            disabled={!canScrollForward}
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      ) : (
        <div className={styles.emptyState} aria-live="polite">
          There are no events available at this time.
        </div>
      )}
    </section>
  )
}
