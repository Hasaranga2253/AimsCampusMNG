import { useEffect, useRef, useState, type ReactNode } from 'react'

import { AuthContext, redirectToLogin } from '@/features/auth/auth-context'
import { authService } from '@/services/auth-service'
import { type AuthUser, type LoginInput, type RegisterInput, type RegisterResponse } from '@/types/auth'

type AuthProviderProps = Readonly<{
  children: ReactNode
}>

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) {
      return
    }

    hasInitialized.current = true
    let isMounted = true
    const token = authService.getStoredAuthToken()

    if (!token) {
      setIsLoading(false)
      return
    }

    void authService
      .getCurrentUser(token)
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser)
        }
      })
      .catch(() => {
        authService.logout()
        if (isMounted) {
          setUser(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const roles = user?.roles ?? []

  const login = async (input: LoginInput): Promise<AuthUser> => {
    const currentUser = await authService.login(input)
    setUser(currentUser)

    return currentUser
  }

  const register = async (input: RegisterInput): Promise<RegisterResponse> => {
    return authService.register(input)
  }

  const refreshUser = async (): Promise<AuthUser | null> => {
    const token = authService.getStoredAuthToken()

    if (!token) {
      setUser(null)
      return null
    }

    try {
      const currentUser = await authService.getCurrentUser(token)
      setUser(currentUser)
      return currentUser
    } catch {
      authService.logout()
      setUser(null)
      return null
    }
  }

  const logout = (): void => {
    authService.logout()
    setUser(null)
    redirectToLogin()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
