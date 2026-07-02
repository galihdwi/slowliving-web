import { api } from './api'
import { unwrapJSend } from './jsend'
import type { Expense, ExpensePayload, JSendResponse, PaginatedData } from '@/types/api'

function toExpenseFormData(payload: ExpensePayload) {
  const formData = new FormData()

  if (payload.expense_category_id) {
    formData.append('expense_category_id', String(payload.expense_category_id))
  }

  if (payload.expense_category_name) {
    formData.append('expense_category_name', payload.expense_category_name)
  }

  formData.append('expense_date', payload.expense_date)
  formData.append('amount', String(payload.amount))
  formData.append('description', payload.description)

  if (payload.proof) {
    formData.append('proof', payload.proof)
  }

  return formData
}

export const expenseService = {
  async list(params?: Record<string, string | number | undefined>) {
    const response = await api.get<JSendResponse<PaginatedData<Expense>>>('/expenses', { params })
    return unwrapJSend(response.data)
  },

  async create(payload: ExpensePayload) {
    const response = await api.post<JSendResponse<{ expense: Expense }>>('/expenses', toExpenseFormData(payload))
    return unwrapJSend(response.data).expense
  },

  async update(id: number, payload: ExpensePayload) {
    const formData = toExpenseFormData(payload)
    formData.append('_method', 'PUT')
    const response = await api.post<JSendResponse<{ expense: Expense }>>(`/expenses/${id}`, formData)
    return unwrapJSend(response.data).expense
  },
}
