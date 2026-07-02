import { api } from './api'
import { unwrapJSend } from './jsend'
import type { JSendResponse, MonthlyDetail, MonthlySummary } from '@/types/api'

export const reportService = {
  async monthlySummary(year: number) {
    const response = await api.get<JSendResponse<MonthlySummary>>('/reports/monthly-summary', {
      params: { year },
    })
    return unwrapJSend(response.data)
  },

  async monthlyDetail(month: string) {
    const response = await api.get<JSendResponse<MonthlyDetail>>('/reports/monthly-detail', {
      params: { month },
    })
    return unwrapJSend(response.data)
  },
}
