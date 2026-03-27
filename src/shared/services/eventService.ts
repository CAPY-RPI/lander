import { apiClient } from './apiClient'
import type {
  CreateEventPayload,
  Event,
  ListEventsResponse,
  UpdateEventPayload,
} from '../models/event'

export function listEvents(limit = 20, offset = 0) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  return apiClient.get<ListEventsResponse>(`/events?${params.toString()}`, { cache: 'no-store' })
}

export function listUserEvents(uid: string) {
  return apiClient.get<ListEventsResponse>(`/users/${uid}/events`, { cache: 'no-store' })
}

export function getEvent(eid: string) {
  return apiClient.get<Event>(`/events/${eid}`, { cache: 'no-store' })
}

export function createEvent(payload: CreateEventPayload) {
  return apiClient.post<Event>('/events', payload)
}

export function updateEvent(eid: string, payload: UpdateEventPayload) {
  return apiClient.put<Event>(`/events/${eid}`, payload)
}

export function deleteEvent(eid: string) {
  return apiClient.delete<void>(`/events/${eid}`)
}

export function listEventRegistrations<TRegistration = unknown>(eid: string) {
  return apiClient.get<TRegistration[]>(`/events/${eid}/registrations`, { cache: 'no-store' })
}
