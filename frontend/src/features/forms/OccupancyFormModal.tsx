import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { House, HouseOccupancyPayload, Resident } from '@/types/api'

type OccupancyFormModalProps = {
  house: House
  residents: Resident[]
  isSubmitting: boolean
  error: string | null
  onClose: () => void
  onSubmit: (houseId: number, payload: HouseOccupancyPayload) => Promise<void>
}

export function OccupancyFormModal({
  house,
  residents,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: OccupancyFormModalProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [payload, setPayload] = useState<HouseOccupancyPayload>({
    resident_id: residents[0]?.id ?? 0,
    start_date: today,
    end_date: null,
    notes: '',
  })

  const canSubmit = useMemo(
    () => payload.resident_id > 0 && Boolean(payload.start_date),
    [payload.resident_id, payload.start_date],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit(house.id, payload)
  }

  return (
    <div className="form-modal-root" role="presentation">
      <button type="button" className="form-modal-scrim" aria-label="Tutup form" onClick={onClose} />
      <section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="occupancy-form-title">
        <div className="form-modal-header">
          <div>
            <p className="eyebrow">Penghuni Rumah</p>
            <h2 id="occupancy-form-title">Kelola Penghuni {house.house_number}</h2>
          </div>
          <button type="button" className="form-close-button" onClick={onClose}>Close</button>
        </div>

        <form className="data-form" onSubmit={handleSubmit}>
          <label>
            Penghuni
            <select
              value={payload.resident_id}
              onChange={(event) => setPayload((current) => ({ ...current, resident_id: Number(event.target.value) }))}
              required
            >
              <option value={0}>Pilih penghuni</option>
              {residents.map((resident) => (
                <option key={resident.id} value={resident.id}>{resident.full_name}</option>
              ))}
            </select>
          </label>

          <div className="form-grid-2">
            <label>
              Mulai Dihuni
              <input
                type="date"
                value={payload.start_date}
                onChange={(event) => setPayload((current) => ({ ...current, start_date: event.target.value }))}
                required
              />
            </label>
            <label>
              Sampai
              <input
                type="date"
                value={payload.end_date ?? ''}
                onChange={(event) => setPayload((current) => ({ ...current, end_date: event.target.value || null }))}
              />
            </label>
          </div>

          <label>
            Catatan
            <textarea
              value={payload.notes ?? ''}
              onChange={(event) => setPayload((current) => ({ ...current, notes: event.target.value }))}
              rows={3}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
