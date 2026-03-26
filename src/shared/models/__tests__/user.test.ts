import { normalizeUser } from '../user'
import type { User } from '../../types/auth'

describe('normalizeUser', () => {
  const baseUser: User = {
    uid: '123',
    email: 'jason@example.com',
    first_name: 'Jason',
    last_name: 'Example',
    role: 'user',
  }

  it('should derive rcsid from email if not provided', () => {
    const normalized = normalizeUser(baseUser)
    expect(normalized.rcsid).toBe('jason')
  })

  it('should use provided rcsid if available', () => {
    const userWithRcsid = { ...baseUser, rcsid: 'jason123' }
    const normalized = normalizeUser(userWithRcsid)
    expect(normalized.rcsid).toBe('jason123')
  })

  it('should provide default values for missing profile fields', () => {
    const normalized = normalizeUser(baseUser)
    expect(normalized.organizations).toEqual([])
    expect(normalized.class_year).toBe('')
    expect(normalized.major).toBe('')
    expect(normalized.phone_number).toBe('')
    expect(normalized.rin).toBe('')
    expect(normalized.interests).toBe('')
  })

  it('should preserve existing profile fields', () => {
    const fullUser: User = {
      ...baseUser,
      organizations: ['Capy Club'],
      class_year: '2026',
      major: 'Computer Science',
      phone_number: '555-0199',
      rin: '661000000',
      interests: 'Coding',
    }
    const normalized = normalizeUser(fullUser)
    expect(normalized.organizations).toEqual(['Capy Club'])
    expect(normalized.class_year).toBe('2026')
    expect(normalized.major).toBe('Computer Science')
    expect(normalized.phone_number).toBe('555-0199')
    expect(normalized.rin).toBe('661000000')
    expect(normalized.interests).toBe('Coding')
  })
})
