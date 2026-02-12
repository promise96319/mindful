let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) return null
    const json = await res.json()
    const newToken = json.data?.accessToken as string | undefined
    if (newToken) {
      accessToken = newToken
      return newToken
    }
    return null
  } catch {
    return null
  }
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  if (
    options.body &&
    typeof options.body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  let res = await fetch(url, { ...options, headers, credentials: 'include' })

  // If 401, try refreshing the token once
  if (res.status === 401 && accessToken) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken()
    }
    const newToken = await refreshPromise
    refreshPromise = null

    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`)
      res = await fetch(url, { ...options, headers, credentials: 'include' })
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new ApiError(res.status, error.message || res.statusText)
  }

  const json = await res.json()
  // API wraps responses in { success, data }
  return (json.data ?? json) as T
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
