import { useMemo, useState } from 'react'
import { Badge, Panel, SearchField } from '@/components/common'
import type { House } from '@/types/api'

export function HousesPage({ houses }: { houses: House[] }) {
  const [search, setSearch] = useState('')

  const filteredHouses = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return houses
    }

    return houses.filter((house) =>
      [
        house.house_number,
        house.address,
        house.house_status === 'occupied' ? 'dihuni' : 'tidak dihuni',
        house.occupancies?.[0]?.resident?.full_name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    )
  }, [houses, search])

  return (
    <Panel
      title="Daftar Rumah"
      subtitle="Termasuk status hunian dan penghuni aktif"
      toolbar={<SearchField placeholder="Cari nomor rumah" value={search} onChange={setSearch} />}
    >
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>No Rumah</th>
              <th>Penghuni</th>
              <th>Status</th>
              <th>Sejak</th>
            </tr>
          </thead>
          <tbody>
            {filteredHouses.map((house) => (
              <tr key={house.id}>
                <td className="primary-cell">{house.house_number}</td>
                <td>{house.occupancies?.[0]?.resident?.full_name ?? '-'}</td>
                <td>
                  <Badge tone={house.house_status === 'occupied' ? 'success' : 'muted'}>
                    {house.house_status === 'occupied' ? 'Dihuni' : 'Tidak dihuni'}
                  </Badge>
                </td>
                <td>{house.created_at ?? '-'}</td>
              </tr>
            ))}
            {filteredHouses.length === 0 && (
              <tr>
                <td colSpan={4}>
                  {search ? 'Rumah tidak ditemukan.' : 'Belum ada data rumah.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
