import { useMemo, useState } from "react";
import { Panel, SearchField, TransactionTable } from "@/components/common";
import type { ActivityRow } from "@/types/admin";
import type { Expense, Payment } from "@/types/api";
import {
  mapExpensesToActivities,
  mapPaymentsToActivities,
} from "@/utils/mapApiData";

type LedgerPageProps = {
  title: string;
  type: ActivityRow["type"];
  payments: Payment[];
  expenses: Expense[];
};

export function LedgerPage({
  title,
  type,
  payments,
  expenses,
}: LedgerPageProps) {
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () =>
      type === "Pemasukan"
        ? mapPaymentsToActivities(payments)
        : mapExpensesToActivities(expenses),
    [expenses, payments, type],
  );

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return rows;
    }

    return rows.filter((row) =>
      [row.date, row.note, row.type, row.amount]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [rows, search]);

  return (
    <Panel
      title={title}
      subtitle={`Daftar ${type.toLowerCase()} yang tercatat di sistem`}
      toolbar={<SearchField placeholder="Cari transaksi" value={search} onChange={setSearch} />}
    >
      <TransactionTable
        rows={filteredRows}
        emptyMessage={search ? "Transaksi tidak ditemukan." : "Belum ada transaksi."}
      />
    </Panel>
  );
}
