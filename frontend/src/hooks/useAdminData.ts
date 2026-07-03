import { useCallback, useEffect, useMemo, useState } from 'react'
import { expenseService, houseService, invoiceService, paymentService, reportService, residentService } from '@/services'
import type { Expense, House, Invoice, MonthlySummaryItem, Payment, Resident, Totals } from '@/types/api'

type AdminDataState = {
  residents: Resident[]
  houses: House[]
  payments: Payment[]
  invoices: Invoice[]
  expenses: Expense[]
  monthlySummary: MonthlySummaryItem[]
}

const emptyState: AdminDataState = {
  residents: [],
  houses: [],
  payments: [],
  invoices: [],
  expenses: [],
  monthlySummary: [],
}

export function useAdminData(isEnabled: boolean) {
  const [data, setData] = useState<AdminDataState>(emptyState)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isEnabled) {
      setData(emptyState)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [residents, houses, payments, invoices, expenses, summary] = await Promise.all([
        residentService.list({ per_page: 100 }),
        houseService.list({ per_page: 100 }),
        paymentService.list({ per_page: 100 }),
        invoiceService.list({ per_page: 100 }),
        expenseService.list({ per_page: 100 }),
        reportService.monthlySummary(new Date().getFullYear()),
      ])

      setData({
        residents: residents.items,
        houses: houses.items,
        payments: payments.items,
        invoices: invoices.items,
        expenses: expenses.items,
        monthlySummary: summary.items,
      })
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Gagal mengambil data backend.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [isEnabled])

  useEffect(() => {
    load()
  }, [load])

  const totals: Totals = useMemo(() => {
    const income = data.monthlySummary.reduce((sum, item) => sum + Number(item.income || 0), 0)
    const expense = data.monthlySummary.reduce((sum, item) => sum + Number(item.expense || 0), 0)

    return {
      income,
      expense,
      balance: income - expense,
      occupiedHouses: data.houses.filter((house) => house.house_status === 'occupied').length,
    }
  }, [data.houses, data.monthlySummary])

  return {
    ...data,
    totals,
    isLoading,
    error,
    refresh: load,
  }
}
