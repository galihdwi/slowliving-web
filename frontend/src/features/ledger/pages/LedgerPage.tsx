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
  const rows =
    type === "Pemasukan"
      ? mapPaymentsToActivities(payments)
      : mapExpensesToActivities(expenses);

  return (
    <Panel
      title={title}
      subtitle={`Daftar ${type.toLowerCase()} yang tercatat di sistem`}
      toolbar={<SearchField placeholder="Cari transaksi" />}
    >
      <TransactionTable rows={rows} />
    </Panel>
  );
}
