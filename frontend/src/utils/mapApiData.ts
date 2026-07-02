import type { ActivityRow } from '@/types/admin'
import type { Expense, Payment } from '@/types/api'

export function mapPaymentsToActivities(payments: Payment[]): ActivityRow[] {
  return payments.map((payment) => ({
    date: payment.payment_date,
    type: 'Pemasukan',
    note: payment.notes || `Pembayaran ${payment.house?.house_number ?? ''}`.trim(),
    amount: Number(payment.amount || 0),
  }))
}

export function mapExpensesToActivities(expenses: Expense[]): ActivityRow[] {
  return expenses.map((expense) => ({
    date: expense.expense_date,
    type: 'Pengeluaran',
    note: expense.description,
    amount: -Math.abs(Number(expense.amount || 0)),
  }))
}
