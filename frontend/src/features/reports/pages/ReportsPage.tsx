import { useEffect, useState } from "react";
import AddMoneyCircleIcon from "@hugeicons/core-free-icons/AddMoneyCircleIcon";
import MoneySend02Icon from "@hugeicons/core-free-icons/MoneySend02Icon";
import Wallet02Icon from "@hugeicons/core-free-icons/Wallet02Icon";
import { Panel, StatCard } from "@/components/common";
import { reportService } from "@/services";
import type { MonthlyDetail, MonthlySummaryItem, Totals } from "@/types/api";
import { formatCurrency } from "@/utils/formatCurrency";

export function ReportsPage({
  totals,
  monthlySummary,
}: {
  totals: Totals;
  monthlySummary: MonthlySummaryItem[];
}) {
  const defaultMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [monthlyDetail, setMonthlyDetail] = useState<MonthlyDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      setIsLoadingDetail(true);
      setDetailError(null);

      try {
        const detail = await reportService.monthlyDetail(selectedMonth);

        if (isMounted) {
          setMonthlyDetail(detail);
        }
      } catch (caught) {
        if (isMounted) {
          const message = caught instanceof Error ? caught.message : "Gagal mengambil detail laporan.";
          setDetailError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingDetail(false);
        }
      }
    }

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedMonth]);

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

      <Panel
        title="Detail transaksi bulan tertentu"
        subtitle="Pemasukan dan pengeluaran untuk bulan yang dipilih"
        toolbar={
          <input
            className="month-input"
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          />
        }
      >
        {detailError && <p className="form-error detail-message">{detailError}</p>}
        {isLoadingDetail && <p className="muted-text detail-message">Mengambil detail laporan...</p>}
        {monthlyDetail && !isLoadingDetail && (
          <>
            <div className="detail-summary">
              <span>Pemasukan <strong>{formatCurrency(Number(monthlyDetail.income_total || 0))}</strong></span>
              <span>Pengeluaran <strong>{formatCurrency(Number(monthlyDetail.expense_total || 0))}</strong></span>
              <span>Saldo <strong>{formatCurrency(Number(monthlyDetail.balance || 0))}</strong></span>
            </div>
            <div className="history-grid report-detail-grid">
              <section>
                <h3>Pemasukan</h3>
                <div className="mini-list">
                  {monthlyDetail.payments.map((payment) => (
                    <div key={payment.id}>
                      <strong>{payment.resident?.full_name ?? `Penghuni #${payment.resident_id}`}</strong>
                      <span>{payment.payment_date} - {formatCurrency(Number(payment.amount || 0))}</span>
                    </div>
                  ))}
                  {monthlyDetail.payments.length === 0 && <span>Tidak ada pemasukan bulan ini.</span>}
                </div>
              </section>
              <section>
                <h3>Pengeluaran</h3>
                <div className="mini-list">
                  {monthlyDetail.expenses.map((expense) => (
                    <div key={expense.id}>
                      <strong>{expense.description}</strong>
                      <span>{expense.expense_date} - {formatCurrency(Number(expense.amount || 0))}</span>
                    </div>
                  ))}
                  {monthlyDetail.expenses.length === 0 && <span>Tidak ada pengeluaran bulan ini.</span>}
                </div>
              </section>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
