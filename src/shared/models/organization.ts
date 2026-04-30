import type { Event } from './event'

export type Organization = {
  oid: string
  name: string
  date_created: string
  date_modified: string
}

export type OrganizationMember = {
  uid: string
  first_name: string
  last_name: string
  email: string
  is_admin: boolean
}

export type CreateOrganizationPayload = Pick<Organization, 'name'>

export type UpdateOrganizationPayload = Partial<Pick<Organization, 'name'>>

export type CreateOrganizationMemberPayload = Pick<OrganizationMember, 'uid' | 'is_admin'>

export type ListOrganizationsResponse = Organization[]

export type ListOrganizationMembersResponse = OrganizationMember[]

export type ListOrganizationEventsResponse = Event[]
