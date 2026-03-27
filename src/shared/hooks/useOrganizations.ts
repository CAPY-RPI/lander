import { useEffect, useState } from 'react'
import type { Organization } from '@/shared/models/organization'
import { listOrganizations } from '@/shared/services/organizationService'

type UseOrganizationsResult = {
  organizations: Organization[]
  isLoading: boolean
  error: string | null
}

/**
 * Fetches the organizations list used by the dashboard carousel.
 */
export function useOrganizations(limit = 20, offset = 0, refreshKey = 0): UseOrganizationsResult {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    const loadOrganizations = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await listOrganizations(limit, offset)
        if (!isCancelled) {
          setOrganizations(response)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Could not load organizations.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadOrganizations()

    return () => {
      isCancelled = true
    }
  }, [limit, offset, refreshKey])

  return { organizations, isLoading, error }
}
