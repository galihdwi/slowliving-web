import { api } from './api'
import { unwrapJSend } from './jsend'
import type { GenerateInvoicePayload, Invoice, JSendResponse, PaginatedData } from '@/types/api'

export const invoiceService = {
  async list(params?: Record<string, string | number | undefined>) {
    const response = await api.get<JSendResponse<PaginatedData<Invoice>>>('/invoices', { params })
    return unwrapJSend(response.data)
  },

  async generateMonthly(payload?: GenerateInvoicePayload) {
    const response = await api.post<JSendResponse<{ created_count: number; items: Invoice[] }>>('/invoices/generate-monthly', payload ?? {})
    return unwrapJSend(response.data)
  },

  async get(id: number) {
    const response = await api.get<JSendResponse<{ invoice: Invoice }>>(`/invoices/${id}`)
    return unwrapJSend(response.data).invoice
  },
}
