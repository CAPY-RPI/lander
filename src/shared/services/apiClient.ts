import { logger } from './logger'

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    }

    logger.debug('Request:', {
      url,
      method: config.method || 'GET',
      body: config.body,
      headers: config.headers,
    })

    const response = await fetch(url, config)

    logger.debug('Response:', {
      url,
      status: response.status,
      statusText: response.statusText,
    })

    if (!response.ok) {
      let errorMessage = `API call error: ${response.status} ${response.statusText}`
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorBody = await response.json()
          if (errorBody && (errorBody.message || errorBody.error)) {
            errorMessage = errorBody.message || errorBody.error
          }
        }
      } catch {
        // Fallback to default message if parsing fails
      }
      logger.error(`API call error: ${response.status} ${response.statusText}`, errorMessage)
      throw new Error(errorMessage)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>
    }

    return undefined as unknown as T
  }

  get<T>(endpoint: string, options?: Omit<RequestInit, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestInit, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestInit, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: Omit<RequestInit, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const API_VERSION = import.meta.env.VITE_API_VERSION || '/api/v1'
export const apiClient = new ApiClient(API_VERSION)
