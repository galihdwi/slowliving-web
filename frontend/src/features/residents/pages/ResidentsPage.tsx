import { Badge, Panel, SearchField } from "@/components/common";
import type { Resident } from "@/types/api";

export function ResidentsPage({ residents }: { residents: Resident[] }) {
  return (
    <Panel
      title="Daftar Penghuni"
      subtitle="Daftar penghuni yang terdaftar di sistem"
      toolbar={<SearchField placeholder="Cari penghuni" />}
    >
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Rumah</th>
              <th>Status</th>
              <th>Telepon</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id}>
                <td className="primary-cell">{resident.full_name}</td>
                <td>-</td>
                <td>
                  <Badge>
                    {resident.resident_status === "permanent"
                      ? "Tetap"
                      : "Kontrak"}
                  </Badge>
                </td>
                <td>{resident.phone_number}</td>
              </tr>
            ))}
            {residents.length === 0 && (
              <tr>
                <td colSpan={4}>Belum ada data penghuni.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
