import { Badge, Panel, SearchField } from '@/components/common'
import type { House } from '@/types/api'

export function HousesPage({ houses }: { houses: House[] }) {
  return (
    <Panel
      title="Daftar Rumah"
      subtitle="Termasuk status hunian dan penghuni aktif"
      toolbar={<SearchField placeholder="Cari nomor rumah" />}
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
            {houses.map((house) => (
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
            {houses.length === 0 && (
              <tr>
                <td colSpan={4}>Belum ada data rumah.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
