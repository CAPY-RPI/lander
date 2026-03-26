import type { User } from '../types/auth'

/**
 * Transforms raw user data from the API into a consistent User object with defaults.
 * This ensures that fields like rcsid, organizations, and profile details are never undefined
 * in the UI, even if the backend doesn't provide them initially.
 */
export const normalizeUser = (data: User): User => {
  return {
    ...data,
    rcsid: data.rcsid || data.email.split('@')[0],
    organizations: data.organizations || [],
    class_year: data.class_year || '',
    major: data.major || '',
    phone_number: data.phone_number || '',
    rin: data.rin || '',
    interests: data.interests || '',
  }
}
