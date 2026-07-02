import AddMoneyCircleIcon from "@hugeicons/core-free-icons/AddMoneyCircleIcon";
import MoneySend02Icon from "@hugeicons/core-free-icons/MoneySend02Icon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";
import { Panel, StatCard } from "@/components/common";
import type { MonthlySummaryItem, Totals } from "@/types/api";
import { formatCurrency } from "@/utils/formatCurrency";

export function ReportsPage({
  totals,
  monthlySummary,
}: {
  totals: Totals;
  monthlySummary: MonthlySummaryItem[];
}) {
  return (
    <div className="page-stack">
      <section className="summary-grid three" aria-label="Ringkasan laporan">
        <StatCard
          label="Total pemasukan"
          value={formatCurrency(totals.income)}
          icon={AddMoneyCircleIcon}
        />
        <StatCard
          label="Total pengeluaran"
          value={formatCurrency(totals.expense)}
          icon={MoneySend02Icon}
        />
        <StatCard
          label="Saldo akhir"
          value={formatCurrency(totals.balance)}
          icon={Wallet02Icon}
          tone="strong"
        />
      </section>

      <Panel
        title="Detail bulanan"
        subtitle="Ringkasan pemasukan, pengeluaran, dan saldo per bulan"
        className="report-table"
      >
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Pemasukan</th>
                <th>Pengeluaran</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((item) => (
                <tr key={item.month}>
                  <td className="primary-cell">{item.month}</td>
                  <td>{formatCurrency(Number(item.income || 0))}</td>
                  <td>{formatCurrency(Number(item.expense || 0))}</td>
                  <td
                    className={
                      Number(item.balance || 0) >= 0
                        ? "income-text"
                        : "expense-text"
                    }
                  >
                    {formatCurrency(Number(item.balance || 0))}
                  </td>
                </tr>
              ))}
              {monthlySummary.length === 0 && (
                <tr>
                  <td colSpan={4}>Belum ada data laporan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
