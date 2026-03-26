export interface User {
  uid: string
  first_name: string
  last_name: string
  grad_year: number
  personal_email: string
  school_email: string
  phone: string
  role: string
}

export interface AuthContextType {
  user: User | null
  isAuthed: boolean
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  saveProfile: (profile: Partial<User>) => Promise<void>
}
