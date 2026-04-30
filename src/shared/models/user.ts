import type { User } from '../types/auth'

/**
 * Transforms raw user data from the API into a consistent User object with defaults.
 * This ensures that fields like rcsid, organizations, and profile details are never undefined
 * in the UI, even if the backend doesn't provide them initially.
 */
export const normalizeUser = (data: User): User => {
  return {
    uid: data.uid,
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    grad_year: typeof data.grad_year === 'number' ? data.grad_year : 0,
    personal_email: data.personal_email || '',
    school_email: data.school_email || '',
    phone: data.phone || '',
    role: data.role || '',
  }
}
