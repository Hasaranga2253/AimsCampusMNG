import { createContext } from 'react'

import {
  type AuthUser,
  type LoginInput,
  type RegisterInput,
  type RegisterResponse,
  type UserRole,
} from '@/types/auth'

export interface AuthContextValue {
  user: AuthUser | null
  roles: readonly UserRole[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<AuthUser>
  register: (input: RegisterInput) => Promise<RegisterResponse>
  logout: () => void
  refreshUser: () => Promise<AuthUser | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function redirectToLogin(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (window.location.pathname !== '/login') {
    window.location.replace('/login')
  }
}
