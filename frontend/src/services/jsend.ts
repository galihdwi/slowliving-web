import type { JSendResponse } from '@/types/api'

export function unwrapJSend<T>(response: JSendResponse<T>): T {
  if (response.status === 'success') {
    return response.data
  }

  if (response.status === 'error') {
    throw new Error(response.message)
  }

  const message =
    typeof response.data === 'object' && response.data && 'message' in response.data
      ? String((response.data as { message: unknown }).message)
      : 'Request gagal.'

  throw new Error(message)
}
