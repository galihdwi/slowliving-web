import { useMemo, useState } from "react";
import { Badge, Panel, SearchField } from "@/components/common";
import type { Resident } from "@/types/api";

export function ResidentsPage({ residents }: { residents: Resident[] }) {
  const [search, setSearch] = useState("");

  const filteredResidents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return residents;
    }

    return residents.filter((resident) =>
      [
        resident.full_name,
        resident.phone_number,
        resident.resident_status === "permanent" ? "tetap" : "kontrak",
        resident.marital_status === "married" ? "menikah" : "belum menikah",
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [residents, search]);

  return (
    <Panel
      title="Daftar Penghuni"
      subtitle="Daftar penghuni yang terdaftar di sistem"
      toolbar={<SearchField placeholder="Cari penghuni" value={search} onChange={setSearch} />}
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
            {filteredResidents.map((resident) => (
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
            {filteredResidents.length === 0 && (
              <tr>
                <td colSpan={4}>
                  {search ? "Penghuni tidak ditemukan." : "Belum ada data penghuni."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
