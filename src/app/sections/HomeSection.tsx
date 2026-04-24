import { useState } from 'react'
import { EventDetailsModal } from '@/app/components/EventDetailsModal'
import { EventRail } from '@/app/components/EventRail'
import { OrgDetailsModal } from '@/app/components/OrgDetailsModal'
import { OrgRail } from '@/app/components/OrgRail'
import type { AppEvent } from '@/app/data/events'
import type { AppOrganization } from '@/app/data/organizations'
import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import { useAuth } from '@/shared/context/AuthContext'
import type { Event } from '@/shared/models/event'
import type { Organization } from '@/shared/models/organization'
import { useOrganizations } from '@/shared/hooks/useOrganizations'
import { useUserEvents } from '@/shared/hooks/useUserEvents'
import { useUserOrganizations } from '@/shared/hooks/useUserOrganizations'
import styles from './HomeSection.module.css'

type HomeSectionProps = {
  eventsRefreshKey?: number
  organizationsRefreshKey?: number
  onEventsChanged: () => void
  onOrganizationsChanged: () => void
}

function toAppEvent(event: Event): AppEvent {
  return {
    eid: event.eid,
    title: event.title || 'Untitled event',
    location: event.location || 'Location to be announced',
    event_time: event.event_time,
    description: event.description || 'Event details coming soon.',
    org_id: event.eid,
  }
}

function toAppOrganization(organization: Organization): AppOrganization {
  return {
    oid: organization.oid,
    name: organization.name || 'Untitled organization',
    date_created: organization.date_created,
    date_modified: organization.date_modified,
  }
}

export function HomeSection({
  eventsRefreshKey = 0,
  organizationsRefreshKey = 0,
  onEventsChanged,
  onOrganizationsChanged,
}: HomeSectionProps) {
  const { isAuthed, user } = useAuth()
  const {
    events: myEvents,
    isLoading: isLoadingMyEvents,
    error: myEventsError,
  } = useUserEvents(user?.uid, isAuthed, eventsRefreshKey)
  const { organizations, isLoading: isLoadingOrganizations } = useOrganizations(
    20,
    0,
    organizationsRefreshKey,
  )
  const {
    organizations: myOrganizations,
    isLoading: isLoadingMyOrganizations,
    error: myOrganizationsError,
  } = useUserOrganizations(organizations, user?.uid, isAuthed, organizationsRefreshKey)

  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<AppOrganization | null>(null)

  const myEventCards = myEvents.map((event) => ({
    ...toAppEvent(event),
    isRegistered: true,
  }))
  const myOrganizationCards = myOrganizations.map((organization) => ({
    ...toAppOrganization(organization),
    isMember: true,
  }))

  return (
    <AnimatedPanel
      className={`panel ${styles.homePanel}`}
      id="home"
      staggerIndex={0}
      data-search-key="section:home"
      data-search-label="home"
      data-search-category="section"
      data-search-description="dashboard home overview"
      data-search-keywords="welcome campus life dashboard my events my orgs"
    >
      {!isAuthed ? (
        <div className={styles.signInPrompt}>
          <p className={styles.signInText}>Sign in to see your events and orgs here.</p>
        </div>
      ) : null}

      {isAuthed ? (
        <>
          {isLoadingMyEvents ? (
            <p className={styles.status}>Loading your events...</p>
          ) : myEventsError ? (
            <p className={styles.error}>{myEventsError}</p>
          ) : (
            <EventRail
              title="my events"
              events={myEventCards}
              carouselLabel="My events carousel"
              onEventSelect={setSelectedEvent}
            />
          )}

          {isLoadingOrganizations || isLoadingMyOrganizations ? (
            <p className={styles.status}>Loading your organizations...</p>
          ) : myOrganizationsError ? (
            <p className={styles.error}>{myOrganizationsError}</p>
          ) : (
            <OrgRail
              title="my orgs"
              organizations={myOrganizationCards}
              carouselLabel="My organizations carousel"
              onOrganizationSelect={setSelectedOrganization}
            />
          )}
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
      <OrgDetailsModal
        organization={selectedOrganization}
        isOpen={selectedOrganization !== null}
        onClose={() => setSelectedOrganization(null)}
        onJoined={() => {
          onOrganizationsChanged()
          setSelectedOrganization((current) => (current ? { ...current, isMember: true } : current))
        }}
        onLeft={() => {
          onOrganizationsChanged()
          setSelectedOrganization((current) =>
            current ? { ...current, isMember: false } : current,
          )
        }}
      />
    </AnimatedPanel>
  )
}
