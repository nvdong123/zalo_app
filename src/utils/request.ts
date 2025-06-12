import { getAccessToken } from 'zmp-sdk'
import { API_URL } from '@/constants/common'
import { 
  BookingNotFoundError, 
  MerchantNotFoundError,
  BookingValidationError,
  UnauthorizedError
} from '@/constants/errors'

const mockUrls = import.meta.glob<{ default: string }>('../mock/*.json', { query: 'url', eager: true })

interface ErrorResponse {
  error: number;
  message: string;
  details?: any;
}

interface ApiResponse<T> {
  error: number;
  message: string;
  data: T;
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const accessToken = await getAccessToken()
    const url = API_URL
      ? `${API_URL}${path}`
      : mockUrls[`../mock${path === '/' ? '/index' : path.split('?')[0]}.json`]?.default
    
    const response = await fetch(url, {
      ...options,
      headers: API_URL
        ? {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...options?.headers,
          }
        : options?.headers,
    })
    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        errorData = await response.json()
      } catch {
        throw new Error(response.statusText)
      }

      // Handle specific error cases
      switch (response.status) {
        case 401:
          throw new UnauthorizedError()
        case 404:
          if (errorData.message === 'Merchant not found') throw new MerchantNotFoundError()
          if (errorData.message === 'Booking not found') throw new BookingNotFoundError()
          break
        case 422:
          throw new BookingValidationError(errorData.message, errorData.details)
      }

      throw new Error(errorData.message || response.statusText)
    }

    const json: ApiResponse<T> = await response.json()
    
    if (json.error < 0) {
      switch (json.message) {
        case 'Merchant not found':
          throw new MerchantNotFoundError()
        case 'Booking not found':
          throw new BookingNotFoundError()
        default:
          throw new Error(json.message)
      }
    }

    return json.data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred')
  }
}

// Helper methods for common API calls
export const api = {
  get: <T>(path: string, options?: RequestInit) => 
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, data?: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(path: string, data?: any, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'DELETE' }),

  // Helper specifically for bookings
  bookings: {
    create: <T>(data: any) =>
      api.post<T>('/api/v1/bookings', data),

    getById: <T>(id: string) =>
      api.get<T>(`/api/v1/bookings/${id}`),

    getUserBookings: <T>() =>
      api.get<T>('/api/v1/bookings/user'),

    cancel: <T>(id: string) =>
      api.put<T>(`/api/v1/bookings/${id}/cancel`),

    update: <T>(id: string, data: any) =>
      api.put<T>(`/api/v1/bookings/${id}`, data)
  }
}

// Re-export common API methods
export const { get, post, put, delete: del } = api