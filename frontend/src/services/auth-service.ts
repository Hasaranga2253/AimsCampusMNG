import { apiClient } from '@/services/api-client'
import {
  type AuthUser,
  type LoginInput,
  type LoginResponse,
  type RegisterInput,
  type RegisterResponse,
} from '@/types/auth'

export const AUTH_TOKEN_STORAGE_KEY = 'aims.auth.token'

type RegisterRequestBody = Readonly<{
  firstName: string
  lastName: string
  email: string
  password: string
}>

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}

export function getStoredAuthToken(): string | null {
  const token = getSessionStorage()?.getItem(AUTH_TOKEN_STORAGE_KEY)

  return token && token.trim().length > 0 ? token : null
}

function setStoredAuthToken(token: string): void {
  const cleanedToken = token.trim()

  if (cleanedToken.length === 0) {
    clearStoredAuthToken()
    return
  }

  getSessionStorage()?.setItem(AUTH_TOKEN_STORAGE_KEY, cleanedToken)
}

function clearStoredAuthToken(): void {
  getSessionStorage()?.removeItem(AUTH_TOKEN_STORAGE_KEY)
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function createRegisterRequestBody(input: RegisterInput): RegisterRequestBody {
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: normalizeEmail(input.email),
    password: input.password,
  }
}

function createLoginRequestBody(input: LoginInput): LoginInput {
  return {
    email: normalizeEmail(input.email),
    password: input.password,
  }
}

function assertAccessToken(value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error('Login succeeded, but the server did not return an access token.')
  }

  return value
}

async function register(input: RegisterInput): Promise<RegisterResponse> {
  const requestBody = createRegisterRequestBody(input)

  return apiClient.post<RegisterResponse, RegisterRequestBody>('/auth/register', requestBody)
}

async function getCurrentUser(token = getStoredAuthToken()): Promise<AuthUser> {
  if (!token) {
    throw new Error('No active session.')
  }

  return apiClient.get<AuthUser>('/auth/me', { token })
}

async function login(input: LoginInput): Promise<AuthUser> {
  const requestBody = createLoginRequestBody(input)

  const response = await apiClient.post<LoginResponse, LoginInput>('/auth/login', requestBody)
  const accessToken = assertAccessToken(response.accessToken)

  setStoredAuthToken(accessToken)

  try {
    return await getCurrentUser(accessToken)
  } catch (error: unknown) {
    clearStoredAuthToken()
    throw error
  }
}

function logout(): void {
  clearStoredAuthToken()
}

export const authService = {
  register,
  login,
  getCurrentUser,
  logout,
  getStoredAuthToken,
}