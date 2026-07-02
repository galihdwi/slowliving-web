import AddMoneyCircleIcon from '@hugeicons/core-free-icons/AddMoneyCircleIcon'
import House05Icon from '@hugeicons/core-free-icons/House05Icon'
import MoneySend02Icon from '@hugeicons/core-free-icons/MoneySend02Icon'
import Wallet02Icon from '@hugeicons/core-free-icons/Wallet02Icon'
import { StatCard } from '@/components/common'
import type { Totals } from '@/types/api'
import { formatCurrency } from '@/utils/formatCurrency'

export function SummaryCards({ totals }: { totals: Totals }) {
  return (
    <section className="summary-grid" aria-label="Ringkasan administrasi">
      <StatCard label="Saldo berjalan" value={formatCurrency(totals.balance)} icon={Wallet02Icon} tone="strong" />
      <StatCard label="Pemasukan tahun ini" value={formatCurrency(totals.income)} icon={AddMoneyCircleIcon} />
      <StatCard label="Pengeluaran tahun ini" value={formatCurrency(totals.expense)} icon={MoneySend02Icon} />
      <StatCard label="Rumah dihuni" value={`${totals.occupiedHouses}/20`} icon={House05Icon} />
    </section>
  )
}
