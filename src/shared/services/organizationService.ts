import type { Event } from '../models/event'
import type {
  CreateOrganizationMemberPayload,
  CreateOrganizationPayload,
  ListOrganizationMembersResponse,
  ListOrganizationsResponse,
  Organization,
  OrganizationMember,
  UpdateOrganizationPayload,
} from '../models/organization'
import { apiClient } from './apiClient'

export function listOrganizations(limit = 20, offset = 0) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  return apiClient.get<ListOrganizationsResponse>(`/organizations?${params.toString()}`, {
    cache: 'no-store',
  })
}

export function getOrganization(oid: string) {
  return apiClient.get<Organization>(`/organizations/${oid}`, { cache: 'no-store' })
}

export function createOrganization(payload: CreateOrganizationPayload) {
  return apiClient.post<Organization>('/organizations', payload)
}

export function updateOrganization(oid: string, payload: UpdateOrganizationPayload) {
  return apiClient.put<Organization>(`/organizations/${oid}`, payload)
}

export function deleteOrganization(oid: string) {
  return apiClient.delete<void>(`/organizations/${oid}`)
}

export function listOrganizationMembers(oid: string) {
  return apiClient.get<ListOrganizationMembersResponse>(`/organizations/${oid}/members`, {
    cache: 'no-store',
  })
}

export function addOrganizationMember(oid: string, payload: CreateOrganizationMemberPayload) {
  return apiClient.post<OrganizationMember>(`/organizations/${oid}/members`, payload)
}

export function removeOrganizationMember(oid: string, uid: string) {
  return apiClient.delete<void>(`/organizations/${oid}/members/${uid}`)
}

export function listOrganizationEvents(oid: string, limit = 20, offset = 0) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  return apiClient.get<Event[]>(`/organizations/${oid}/events?${params.toString()}`, {
    cache: 'no-store',
  })
}
