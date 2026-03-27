export type Event = {
  eid: string
  title: string
  location: string
  event_time: string
  description: string
  date_created?: string
  date_modified?: string
}

export type EventRegistration = {
  eid?: string
  uid?: string
  is_attending?: boolean
  date_created?: string
  date_modified?: string
}

export type CreateEventPayload = {
  org_id: string
} & Partial<Pick<Event, 'title' | 'location' | 'event_time' | 'description'>>

export type UpdateEventPayload = Partial<
  Pick<Event, 'title' | 'location' | 'event_time' | 'description'>
>

export type ListEventsResponse = Event[]
