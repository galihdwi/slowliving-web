import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/ui/button'
import type { ActivityRow } from '@/types/admin'
import type { Expense } from '@/types/api'
import { formatCurrency } from '@/utils/formatCurrency'

type TransactionTableProps = {
  rows: ActivityRow[]
  emptyMessage?: string
  expenses?: Expense[]
  onEditExpense?: (expense: Expense) => void
}

export function TransactionTable({ rows, emptyMessage = 'Belum ada transaksi.', expenses = [], onEditExpense }: TransactionTableProps) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Keterangan</th>
            <th>Tipe</th>
            <th>Nominal</th>
            {onEditExpense && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const editableExpense = expenses.find(
              (expense) => expense.expense_date === row.date && expense.description === row.note,
            )

            return (
              <tr key={`${row.date}-${row.note}`}>
                <td>{row.date}</td>
                <td className="primary-cell">{row.note}</td>
                <td><Badge tone={row.type === 'Pemasukan' ? 'success' : 'default'}>{row.type}</Badge></td>
                <td className={row.amount > 0 ? 'amount income-text' : 'amount expense-text'}>
                  {formatCurrency(row.amount)}
                </td>
                {onEditExpense && (
                  <td>
                    {editableExpense && (
                      <Button type="button" size="xs" variant="outline" onClick={() => onEditExpense(editableExpense)}>
                        Ubah
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={onEditExpense ? 5 : 4}>{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
