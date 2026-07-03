import { Fragment, useMemo, useState } from 'react'
import { Badge, Panel, SearchField } from '@/components/common'
import { Button } from '@/components/ui/button'
import { houseService } from '@/services'
import type { House, HouseDetail, Invoice } from '@/types/api'
import { formatCurrency } from '@/utils/formatCurrency'

type HousesPageProps = {
  houses: House[]
  invoices: Invoice[]
  onEditHouse: (house: House) => void
  onManageOccupancy: (house: House) => void
}

export function HousesPage({ houses, invoices, onEditHouse, onManageOccupancy }: HousesPageProps) {
  const [search, setSearch] = useState('')
  const [expandedHouseId, setExpandedHouseId] = useState<number | null>(null)
  const [houseDetails, setHouseDetails] = useState<Record<number, HouseDetail>>({})
  const [detailError, setDetailError] = useState<string | null>(null)

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

  async function toggleHistory(house: House) {
    const nextId = expandedHouseId === house.id ? null : house.id
    setExpandedHouseId(nextId)
    setDetailError(null)

    if (nextId && !houseDetails[house.id]) {
      try {
        const detail = await houseService.get(house.id)
        setHouseDetails((current) => ({ ...current, [house.id]: detail }))
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Gagal mengambil riwayat rumah.'
        setDetailError(message)
      }
    }
  }

  function latestInvoiceStatus(house: House) {
    const invoice = invoices
      .filter((item) => item.house_id === house.id)
      .sort((a, b) => String(b.period_month).localeCompare(String(a.period_month)))[0]

    if (!invoice) {
      return 'Belum ada tagihan'
    }

    if (invoice.status === 'paid') {
      return 'Lunas'
    }

    if (invoice.status === 'partial') {
      return 'Sebagian'
    }

    return 'Belum lunas'
  }

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
              <th>Pembayaran</th>
              <th>Sejak</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredHouses.map((house) => {
              const detail = houseDetails[house.id]
              const isExpanded = expandedHouseId === house.id

              return (
                <Fragment key={house.id}>
                  <tr key={house.id}>
                    <td className="primary-cell">{house.house_number}</td>
                    <td>{house.occupancies?.[0]?.resident?.full_name ?? '-'}</td>
                    <td>
                      <Badge tone={house.house_status === 'occupied' ? 'success' : 'muted'}>
                        {house.house_status === 'occupied' ? 'Dihuni' : 'Tidak dihuni'}
                      </Badge>
                    </td>
                    <td>{latestInvoiceStatus(house)}</td>
                    <td>{house.occupancies?.[0]?.start_date ?? house.created_at ?? '-'}</td>
                    <td>
                      <div className="row-actions">
                        <Button type="button" size="xs" variant="outline" onClick={() => onEditHouse(house)}>Ubah</Button>
                        <Button type="button" size="xs" variant="outline" onClick={() => onManageOccupancy(house)}>Penghuni</Button>
                        <Button type="button" size="xs" onClick={() => toggleHistory(house)}>
                          {isExpanded ? 'Tutup' : 'Riwayat'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${house.id}-history`} className="detail-row">
                      <td colSpan={6}>
                        {detailError && <p className="form-error">{detailError}</p>}
                        {!detail && !detailError && <p className="muted-text">Mengambil riwayat rumah...</p>}
                        {detail && (
                          <div className="history-grid">
                            <section>
                              <h3>History Penghuni</h3>
                              <div className="mini-list">
                                {detail.occupancy_history.map((occupancy) => (
                                  <div key={occupancy.id}>
                                    <strong>{occupancy.resident?.full_name ?? `Penghuni #${occupancy.resident_id}`}</strong>
                                    <span>{occupancy.start_date} sampai {occupancy.end_date ?? 'sekarang'}</span>
                                  </div>
                                ))}
                                {detail.occupancy_history.length === 0 && <span>Belum ada history penghuni.</span>}
                              </div>
                            </section>
                            <section>
                              <h3>History Pembayaran</h3>
                              <div className="mini-list">
                                {detail.payment_history.map((invoice) => (
                                  <div key={invoice.id}>
                                    <strong>{invoice.resident?.full_name ?? `Penghuni #${invoice.resident_id}`}</strong>
                                    <span>
                                      {invoice.period_month} - {formatCurrency(Number(invoice.total_amount || 0))}
                                      {' '}({invoice.status === 'paid' ? 'Lunas' : invoice.status === 'partial' ? 'Sebagian' : 'Belum lunas'})
                                    </span>
                                  </div>
                                ))}
                                {detail.payment_history.length === 0 && <span>Belum ada history pembayaran.</span>}
                              </div>
                            </section>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
            {filteredHouses.length === 0 && (
              <tr>
                <td colSpan={6}>
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
