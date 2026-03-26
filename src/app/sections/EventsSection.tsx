import type { WheelEvent } from 'react'
import { useRef } from 'react'
import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import { useAuth } from '@/shared/context/AuthContext'
import { useHorizontalWheelScroll } from '@/shared/hooks/useHorizontalWheelScroll'
import styles from './EventsSection.module.css'

const myEvents = [
  {
    title: 'Startup Sprint Demo Night',
    location: 'Innovation Lab',
    event_time: '2026-03-27T18:30:00Z',
    description:
      'Pitch practice, rapid demos, and founder feedback for teams building before finals week.',
    org_id: '550e8400-e29b-41d4-a716-446655440000',
  },
  {
    title: 'Sunrise Run Club',
    location: 'North Quad',
    event_time: '2026-03-28T07:00:00Z',
    description:
      'Low-pressure miles, coffee after, and enough accountability to actually leave your dorm.',
    org_id: '0b2f0d2f-7f6d-49c3-9a55-946bce7d1111',
  },
  {
    title: 'Design Crit and Portfolio Lab',
    location: 'Media Studio 204',
    event_time: '2026-03-31T17:15:00Z',
    description: 'Bring a draft, get sharp feedback, and leave with a cleaner portfolio story.',
    org_id: '6aa0ef8f-b8fb-4c13-b060-2e7d0f4c2222',
  },
  {
    title: 'Volunteer Garden Reset',
    location: 'Campus Greenhouse',
    event_time: '2026-04-01T15:30:00Z',
    description:
      'Help prep beds for spring planting, then split snacks and starter herbs with the crew.',
    org_id: '2d9b7b44-8cf4-4db5-9863-1f3c2f183333',
  },
  {
    title: 'Women in Tech Mixer',
    location: 'Engineering Atrium',
    event_time: '2026-04-02T18:00:00Z',
    description:
      'Short intros, recruiter chats, and actual conversation prompts instead of awkward hovering.',
    org_id: '7c4070f3-8fca-4f2e-9dc6-738553204444',
  },
  {
    title: 'Open Mic Basement Sessions',
    location: 'Commons Basement',
    event_time: '2026-04-03T20:30:00Z',
    description:
      'Poetry, acoustic sets, and low-stakes stage time for anyone testing something new.',
    org_id: 'edca8c61-ff14-4fbe-8ae6-b8f11f0d5555',
  },
  {
    title: 'Finance Interview Drill Room',
    location: 'Career Center 118',
    event_time: '2026-04-04T16:45:00Z',
    description:
      'Timed technical rounds and peer feedback for anyone trying to sharpen before recruiting season.',
    org_id: 'fb9708d9-b6e9-49ae-a181-02617cd76666',
  },
  {
    title: 'Film Club Rooftop Screening',
    location: 'West Hall Rooftop',
    event_time: '2026-04-05T19:45:00Z',
    description:
      'Bring a blanket, vote on the final cut, and stay for the debate after the credits roll.',
    org_id: '6df10a82-a297-46a5-8e4d-8bf806e27777',
  },
]

const recommendedEvents = [
  {
    title: 'Moonlight Market',
    location: 'Student Center Lawn',
    event_time: '2026-04-02T20:00:00Z',
    description:
      'Late-night food stalls, student vendors, and a live DJ set under the string lights.',
    org_id: '940d57fd-3c9a-4ae8-850a-d94120068888',
  },
  {
    title: 'AI for Everyone Fireside',
    location: 'Library Forum',
    event_time: '2026-04-03T16:00:00Z',
    description:
      'A practical conversation on using AI tools without losing your own judgment or voice.',
    org_id: '4e2cc020-2d1c-4d85-9d9a-e56aa1099999',
  },
  {
    title: 'Pottery Pop-Up',
    location: 'Arts Courtyard',
    event_time: '2026-04-05T13:00:00Z',
    description:
      'Wheel demos, hand-building stations, and take-home clay kits while supplies last.',
    org_id: '8e746a88-3cab-46b5-b80f-fdb65f2aaaaa',
  },
  {
    title: 'Night Market Thrift Swap',
    location: 'Union Arcade',
    event_time: '2026-04-06T18:00:00Z',
    description:
      'Trade pieces you are done with, browse student racks, and leave with a better jacket.',
    org_id: '0f4f70bd-e2a8-48c7-a7bf-9a05f44bbbbb',
  },
  {
    title: 'Hack and Snack Study Jam',
    location: 'CS Lab East',
    event_time: '2026-04-07T20:00:00Z',
    description:
      'A quiet build session with mentors floating, whiteboards open, and enough snacks to stay late.',
    org_id: 'c1763eb7-109f-4d7f-bf19-cba0a8dfcccc',
  },
  {
    title: 'Street Photography Walk',
    location: 'Downtown Station',
    event_time: '2026-04-08T17:30:00Z',
    description:
      'Golden-hour shooting prompts, editing tips, and a group critique after the walk back.',
    org_id: 'd3176f00-8224-4302-b7ea-2c2a9476dddd',
  },
  {
    title: 'Founder Office Hours',
    location: 'Launchpad Hub',
    event_time: '2026-04-09T14:15:00Z',
    description:
      'Book a quick slot to pressure-test an idea, pricing plan, or pitch with alumni founders.',
    org_id: '27ee52ab-0d70-49d8-9182-2cf94431eeee',
  },
  {
    title: 'Campus Food Crawl',
    location: 'Main Quad Fountain',
    event_time: '2026-04-10T17:45:00Z',
    description:
      'Small groups hit the best late-day food spots on and around campus with zero planning required.',
    org_id: '8b3c1409-8804-4ff4-a0d1-4d330e4fffff',
  },
] as const

type EventCardProps = {
  title: string
  location: string
  event_time: string
  description: string
}

const eventDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

function formatEventDate(value: string) {
  return eventDateFormatter.format(new Date(value))
}

function EventCard({ title, location, event_time, description }: EventCardProps) {
  return (
    <article className={styles.eventCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>

      <dl className={styles.metaList}>
        <div className={styles.metaRow}>
          <dt>Date</dt>
          <dd>{formatEventDate(event_time)}</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>Place</dt>
          <dd>{location}</dd>
        </div>
      </dl>
    </article>
  )
}

export function EventsSection() {
  const { isAuthed } = useAuth()
  const myEventsRef = useRef<HTMLDivElement | null>(null)
  const recommendedEventsRef = useRef<HTMLDivElement | null>(null)

  useHorizontalWheelScroll(myEventsRef, { speed: 1, endCutoffPx: 0 })
  useHorizontalWheelScroll(recommendedEventsRef, { speed: 1, endCutoffPx: 0 })

  const stopWheelPropagation = (event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <AnimatedPanel className={`panel ${styles.eventsPanel}`} id="events" staggerIndex={2}>
      {isAuthed ? (
        <section className={styles.eventGroup} aria-labelledby="my-events-heading">
          <div className={styles.groupHeader}>
            <h2 className={styles.groupTitle} id="my-events-heading">
              my events
            </h2>
          </div>

          <div
            ref={myEventsRef}
            className={styles.carousel}
            aria-label="My events carousel"
            onWheelCapture={stopWheelPropagation}
            tabIndex={0}
          >
            {myEvents.map((event) => (
              <EventCard key={`${event.org_id}-${event.event_time}`} {...event} />
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.eventGroup} aria-labelledby="recommended-events-heading">
        <div className={styles.groupHeader}>
          <h2 className={styles.groupTitle} id="recommended-events-heading">
            recommended
          </h2>
        </div>

        <div
          ref={recommendedEventsRef}
          className={styles.carousel}
          aria-label="Recommended events carousel"
          onWheelCapture={stopWheelPropagation}
          tabIndex={0}
        >
          {recommendedEvents.map((event) => (
            <EventCard key={`${event.org_id}-${event.event_time}`} {...event} />
          ))}
        </div>
      </section>
    </AnimatedPanel>
  )
}
