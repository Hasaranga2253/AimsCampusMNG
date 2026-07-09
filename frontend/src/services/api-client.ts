type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type QueryParams = Record<string, string | number | boolean | null | undefined>

type RequestOptions<TBody> = Readonly<{
  body?: TBody
  headers?: HeadersInit
  token?: string | null
  query?: QueryParams
  signal?: AbortSignal
}>

type ErrorPayload = Readonly<{
  error?: string
  message?: string | readonly string[]
  statusCode?: number
}>

const DEFAULT_API_BASE_URL = 'http://localhost:3001/api/v1'

function getApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  const baseUrl =
    configuredBaseUrl && configuredBaseUrl.length > 0
      ? configuredBaseUrl
      : DEFAULT_API_BASE_URL

  return baseUrl.replace(/\/+$/, '')
}

function createUrl(path: string, query?: QueryParams): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${getApiBaseUrl()}${normalizedPath}`)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text.trim().length > 0 ? text : null
}

function isErrorPayload(value: unknown): value is ErrorPayload {
  return typeof value === 'object' && value !== null
}

function getErrorMessageFromPayload(payload: unknown): string | null {
  if (typeof payload === 'string' && payload.trim().length > 0) {
    return payload
  }

  if (!isErrorPayload(payload)) {
    return null
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(' ')
  }

  if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
    return payload.message
  }

  if (typeof payload.error === 'string' && payload.error.trim().length > 0) {
    return payload.error
  }

  return null
}

export class ApiClientError extends Error {
  readonly status: number
  readonly payload: unknown

  constructor(status: number, message: string, payload: unknown) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.payload = payload
  }
}

export class ApiNetworkError extends Error {
  constructor(message = 'Unable to connect to the server. Please check whether the backend is running.') {
    super(message)
    this.name = 'ApiNetworkError'
  }
}

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiClientError || error instanceof ApiNetworkError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallbackMessage
}

async function request<TResponse, TBody = never>(
  method: HttpMethod,
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token && options.token.trim().length > 0) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  let response: Response

  try {
    response = await fetch(createUrl(path, options.query), {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new ApiNetworkError()
  }

  const payload = await parseResponseBody(response)

  if (!response.ok) {
    const message = getErrorMessageFromPayload(payload) ?? `Request failed with status ${response.status}.`
    throw new ApiClientError(response.status, message, payload)
  }

  return payload as TResponse
}

export const apiClient = {
  get<TResponse>(path: string, options: Omit<RequestOptions<never>, 'body'> = {}) {
    return request<TResponse>('GET', path, options)
  },

  post<TResponse, TBody>(path: string, body: TBody, options: Omit<RequestOptions<TBody>, 'body'> = {}) {
    return request<TResponse, TBody>('POST', path, {
      ...options,
      body,
    })
  },

  put<TResponse, TBody>(path: string, body: TBody, options: Omit<RequestOptions<TBody>, 'body'> = {}) {
    return request<TResponse, TBody>('PUT', path, {
      ...options,
      body,
    })
  },

  patch<TResponse, TBody>(path: string, body: TBody, options: Omit<RequestOptions<TBody>, 'body'> = {}) {
    return request<TResponse, TBody>('PATCH', path, {
      ...options,
      body,
    })
  },

  delete<TResponse>(path: string, options: Omit<RequestOptions<never>, 'body'> = {}) {
    return request<TResponse>('DELETE', path, options)
  },
}