export interface User {
  uid: string
  email: string
  first_name: string
  last_name: string
  role: string
  rcsid?: string
  organizations?: string[]
  class_year?: string
  major?: string
  phone_number?: string
  rin?: string
  interests?: string
}

export interface AuthContextType {
  user: User | null
  isAuthed: boolean
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  saveProfile: (
    profile: Pick<
      User,
      | 'email'
      | 'first_name'
      | 'last_name'
      | 'rcsid'
      | 'organizations'
      | 'class_year'
      | 'major'
      | 'phone_number'
      | 'rin'
      | 'interests'
    >,
  ) => Promise<void>
}
