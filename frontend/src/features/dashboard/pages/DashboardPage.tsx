import { Panel, TransactionTable } from '@/components/common'
import type { Expense, MonthlySummaryItem, Payment, Totals } from '@/types/api'
import { mapExpensesToActivities, mapPaymentsToActivities } from '@/utils/mapApiData'
import { MonthlyBarChart } from '../components/MonthlyBarChart'
import { SummaryCards } from '../components/SummaryCards'

type DashboardPageProps = {
  totals: Totals
  monthlySummary: MonthlySummaryItem[]
  payments: Payment[]
  expenses: Expense[]
}

export function DashboardPage({ totals, monthlySummary, payments, expenses }: DashboardPageProps) {
  const activities = [...mapPaymentsToActivities(payments), ...mapExpensesToActivities(expenses)]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8)

  return (
    <div className="page-stack">
      <SummaryCards totals={totals} />

      <section className="content-grid" aria-label="Grafik dan aktivitas">
        <Panel title="Pemasukan vs Pengeluaran" subtitle="Tampilan 12 bulan berjalan" className="chart-panel">
          <MonthlyBarChart items={monthlySummary} />
        </Panel>

        <Panel title="Aktivitas terbaru" subtitle="Transaksi kas terakhir">
          <TransactionTable rows={activities} />
        </Panel>
      </section>
    </div>
  )
}
