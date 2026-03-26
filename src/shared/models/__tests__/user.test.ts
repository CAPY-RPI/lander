import { normalizeUser } from '../user'
import type { User } from '../../types/auth'

describe('normalizeUser', () => {
  const baseUser: User = {
    uid: '123',
    first_name: 'Jason',
    last_name: 'Example',
    grad_year: 2026,
    personal_email: 'jason@example.com',
    school_email: 'jason@school.edu',
    phone: '555-0199',
    role: 'user',
  }

  it('should provide default values for missing fields', () => {
    const partialUser = {
      uid: '456',
      first_name: '',
      last_name: '',
      grad_year: 0,
      personal_email: '',
      school_email: '',
      phone: '',
      role: '',
    }
    const normalized = normalizeUser(partialUser)
    expect(normalized.uid).toBe('456')
    expect(normalized.first_name).toBe('')
    expect(normalized.last_name).toBe('')
    expect(normalized.grad_year).toBe(0)
    expect(normalized.personal_email).toBe('')
    expect(normalized.school_email).toBe('')
    expect(normalized.phone).toBe('')
    expect(normalized.role).toBe('')
  })

  it('should preserve existing values', () => {
    const normalized = normalizeUser(baseUser)
    expect(normalized.uid).toBe('123')
    expect(normalized.first_name).toBe('Jason')
    expect(normalized.last_name).toBe('Example')
    expect(normalized.grad_year).toBe(2026)
    expect(normalized.personal_email).toBe('jason@example.com')
    expect(normalized.school_email).toBe('jason@school.edu')
    expect(normalized.phone).toBe('555-0199')
    expect(normalized.role).toBe('user')
  })
})
