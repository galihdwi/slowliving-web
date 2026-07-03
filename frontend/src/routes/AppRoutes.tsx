import type { PageKey } from '@/types/admin'
import { DashboardPage } from '@/features/dashboard'
import { HousesPage } from '@/features/houses'
import { LedgerPage } from '@/features/ledger'
import { ReportsPage } from '@/features/reports'
import { ResidentsPage } from '@/features/residents'
import type { Expense, House, Invoice, MonthlySummaryItem, Payment, Resident, Totals } from '@/types/api'

type AppRoutesProps = {
  activePage: PageKey
  totals: Totals
  residents: Resident[]
  houses: House[]
  payments: Payment[]
  invoices: Invoice[]
  expenses: Expense[]
  monthlySummary: MonthlySummaryItem[]
  onEditResident: (resident: Resident) => void
  onEditHouse: (house: House) => void
  onEditExpense: (expense: Expense) => void
  onManageOccupancy: (house: House) => void
}

export function AppRoutes({
  activePage,
  totals,
  residents,
  houses,
  payments,
  invoices,
  expenses,
  monthlySummary,
  onEditResident,
  onEditHouse,
  onEditExpense,
  onManageOccupancy,
}: AppRoutesProps) {
  if (activePage === 'dashboard') {
    return <DashboardPage totals={totals} monthlySummary={monthlySummary} payments={payments} expenses={expenses} />
  }

  if (activePage === 'residents') {
    return <ResidentsPage residents={residents} onEditResident={onEditResident} />
  }

  if (activePage === 'houses') {
    return <HousesPage houses={houses} invoices={invoices} onEditHouse={onEditHouse} onManageOccupancy={onManageOccupancy} />
  }

  if (activePage === 'payments') {
    return <LedgerPage title="Pembayaran" type="Pemasukan" payments={payments} expenses={expenses} />
  }

  if (activePage === 'expenses') {
    return <LedgerPage title="Pengeluaran" type="Pengeluaran" payments={payments} expenses={expenses} onEditExpense={onEditExpense} />
  }

  return <ReportsPage totals={totals} monthlySummary={monthlySummary} />
}
