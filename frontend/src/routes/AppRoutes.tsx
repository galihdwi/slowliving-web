import type { PageKey } from '@/types/admin'
import { DashboardPage } from '@/features/dashboard'
import { HousesPage } from '@/features/houses'
import { LedgerPage } from '@/features/ledger'
import { ReportsPage } from '@/features/reports'
import { ResidentsPage } from '@/features/residents'
import type { Expense, House, MonthlySummaryItem, Payment, Resident, Totals } from '@/types/api'

type AppRoutesProps = {
  activePage: PageKey
  totals: Totals
  residents: Resident[]
  houses: House[]
  payments: Payment[]
  expenses: Expense[]
  monthlySummary: MonthlySummaryItem[]
}

export function AppRoutes({
  activePage,
  totals,
  residents,
  houses,
  payments,
  expenses,
  monthlySummary,
}: AppRoutesProps) {
  if (activePage === 'dashboard') {
    return <DashboardPage totals={totals} monthlySummary={monthlySummary} payments={payments} expenses={expenses} />
  }

  if (activePage === 'residents') {
    return <ResidentsPage residents={residents} />
  }

  if (activePage === 'houses') {
    return <HousesPage houses={houses} />
  }

  if (activePage === 'payments') {
    return <LedgerPage title="Pembayaran" type="Pemasukan" payments={payments} expenses={expenses} />
  }

  if (activePage === 'expenses') {
    return <LedgerPage title="Pengeluaran" type="Pengeluaran" payments={payments} expenses={expenses} />
  }

  return <ReportsPage totals={totals} monthlySummary={monthlySummary} />
}
