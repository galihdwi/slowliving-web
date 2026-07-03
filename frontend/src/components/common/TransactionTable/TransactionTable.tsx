import { Badge } from '@/components/common/Badge'
import type { ActivityRow } from '@/types/admin'
import { formatCurrency } from '@/utils/formatCurrency'

type TransactionTableProps = {
  rows: ActivityRow[]
  emptyMessage?: string
}

export function TransactionTable({ rows, emptyMessage = 'Belum ada transaksi.' }: TransactionTableProps) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Keterangan</th>
            <th>Tipe</th>
            <th>Nominal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.date}-${row.note}`}>
              <td>{row.date}</td>
              <td className="primary-cell">{row.note}</td>
              <td><Badge tone={row.type === 'Pemasukan' ? 'success' : 'default'}>{row.type}</Badge></td>
              <td className={row.amount > 0 ? 'amount income-text' : 'amount expense-text'}>
                {formatCurrency(row.amount)}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4}>{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
