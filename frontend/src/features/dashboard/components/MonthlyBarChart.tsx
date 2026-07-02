import type { MonthlySummaryItem } from '@/types/api'

export function MonthlyBarChart({ items }: { items: MonthlySummaryItem[] }) {
  const max = Math.max(...items.flatMap((data) => [Number(data.income || 0), Number(data.expense || 0)]), 1)

  return (
    <>
      <div className="bar-chart" aria-label="Grafik batang pemasukan dan pengeluaran">
        {items.map((item) => (
          <div className="bar-group" key={item.month}>
            <div className="bars">
              <span className="bar income" style={{ height: `${(Number(item.income || 0) / max) * 100}%` }} />
              <span className="bar expense" style={{ height: `${(Number(item.expense || 0) / max) * 100}%` }} />
            </div>
            <small>{item.month.slice(5) || item.month}</small>
          </div>
        ))}
      </div>
      <div className="legend-row">
        <span><i className="legend income" /> Pemasukan</span>
        <span><i className="legend expense" /> Pengeluaran</span>
      </div>
    </>
  )
}
