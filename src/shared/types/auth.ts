export interface User {
  uid: string
  email: string
  first_name: string
  last_name: string
  role: string
}

export interface AuthContextType {
  user: User | null
  isAuthed: boolean
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}
