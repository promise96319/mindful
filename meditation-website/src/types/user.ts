export interface AppUser {
  id: string
  displayName: string
  email: string
  photoURL: string
  totalPracticeSeconds: number
  settings: {
    theme: string
    language: string
  }
  createdAt?: string
}
