import { api } from './api'
import { unwrapJSend } from './jsend'
import { clearAccessToken, setAccessToken } from './tokenStorage'
import type { JSendResponse, LoginPayload, LoginResponse, User } from '@/types/api'

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post<JSendResponse<LoginResponse>>('/auth/login', payload)
    const data = unwrapJSend(response.data)
    setAccessToken(data.access_token)
    return data
  },

  async logout() {
    try {
      const response = await api.post<JSendResponse<{ message: string }>>('/auth/logout')
      return unwrapJSend(response.data)
    } finally {
      clearAccessToken()
    }
  },

  async me() {
    const response = await api.get<JSendResponse<{ user: User }>>('/me')
    return unwrapJSend(response.data).user
  },
}
