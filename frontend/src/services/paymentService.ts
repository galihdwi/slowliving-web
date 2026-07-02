import { api } from './api'
import { unwrapJSend } from './jsend'
import type { JSendResponse, PaginatedData, Payment, PaymentPayload } from '@/types/api'

export const paymentService = {
  async list(params?: Record<string, string | number | undefined>) {
    const response = await api.get<JSendResponse<PaginatedData<Payment>>>('/payments', { params })
    return unwrapJSend(response.data)
  },

  async create(payload: PaymentPayload) {
    const response = await api.post<JSendResponse<{ payment: Payment }>>('/payments', payload)
    return unwrapJSend(response.data).payment
  },
}
