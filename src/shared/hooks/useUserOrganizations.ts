import { useEffect, useState } from 'react'
import type { Organization } from '@/shared/models/organization'
import { listOrganizationMembers } from '@/shared/services/organizationService'

type UseUserOrganizationsResult = {
  organizations: Organization[]
  membershipByOrgId: Record<string, boolean>
  isLoading: boolean
  error: string | null
}

/**
 * Derives the authenticated user's organizations by checking membership against
 * the current organizations list because the API does not expose a dedicated
 * `/users/{uid}/organizations` endpoint yet.
 */
export function useUserOrganizations(
  sourceOrganizations: Organization[],
  uid?: string,
  isAuthed = false,
  refreshKey = 0,
): UseUserOrganizationsResult {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [membershipByOrgId, setMembershipByOrgId] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthed || !uid || sourceOrganizations.length === 0) {
      setOrganizations([])
      setMembershipByOrgId({})
      setIsLoading(false)
      setError(null)
      return
    }

    let isCancelled = false

    const loadMemberships = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const membershipEntries = await Promise.all(
          sourceOrganizations.map(async (organization) => {
            const members = await listOrganizationMembers(organization.oid)
            return [organization.oid, members.some((member) => member.uid === uid)] as const
          }),
        )

        if (isCancelled) {
          return
        }

        const nextMembershipByOrgId = Object.fromEntries(membershipEntries)
        setMembershipByOrgId(nextMembershipByOrgId)
        setOrganizations(
          sourceOrganizations.filter((organization) => nextMembershipByOrgId[organization.oid]),
        )
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Could not load your organizations.')
          setMembershipByOrgId({})
          setOrganizations([])
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadMemberships()

    return () => {
      isCancelled = true
    }
  }, [sourceOrganizations, uid, isAuthed, refreshKey])

  return { organizations, membershipByOrgId, isLoading, error }
}
