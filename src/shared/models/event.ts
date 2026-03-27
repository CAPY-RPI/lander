export type Event = {
  eid: string
  location: string
  event_time: string
  description: string
  date_created?: string
  date_modified?: string
}

export type CreateEventPayload = {
  org_id: string
} & Partial<Pick<Event, 'location' | 'event_time' | 'description'>>

export type UpdateEventPayload = Partial<Pick<Event, 'location' | 'event_time' | 'description'>>

export type ListEventsResponse = Event[]
