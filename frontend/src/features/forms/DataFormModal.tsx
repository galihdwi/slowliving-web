import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { ExpensePayload, House, HousePayload, PaymentPayload, Resident, ResidentPayload } from '@/types/api'
import type { PageKey } from '@/types/admin'

type FormPageKey = Extract<PageKey, 'residents' | 'houses' | 'payments' | 'expenses'>

type DataFormModalProps = {
  type: FormPageKey
  residents: Resident[]
  houses: House[]
  isSubmitting: boolean
  error: string | null
  onClose: () => void
  onSubmit: (type: FormPageKey, payload: ResidentPayload | HousePayload | PaymentPayload | ExpensePayload) => Promise<void>
}

const formTitles: Record<FormPageKey, string> = {
  residents: 'Tambah Penghuni',
  houses: 'Tambah Rumah',
  payments: 'Tambah Pembayaran',
  expenses: 'Tambah Pengeluaran',
}

export function DataFormModal({
  type,
  residents,
  houses,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: DataFormModalProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [residentPayload, setResidentPayload] = useState<ResidentPayload>({
    full_name: '',
    resident_status: 'permanent',
    phone_number: '',
    marital_status: 'single',
    ktp_photo: null,
  })
  const [housePayload, setHousePayload] = useState<HousePayload>({
    house_number: '',
    address: '',
    house_status: 'vacant',
  })
  const [paymentPayload, setPaymentPayload] = useState<PaymentPayload>({
    resident_id: residents[0]?.id ?? 0,
    house_id: houses[0]?.id ?? 0,
    payment_date: today,
    amount: 0,
    payment_method: 'cash',
    notes: '',
  })
  const [expensePayload, setExpensePayload] = useState<ExpensePayload>({
    expense_category_name: '',
    expense_date: today,
    amount: 0,
    description: '',
    proof: null,
  })

  const canSubmit = useMemo(() => {
    if (type === 'payments') {
      return paymentPayload.resident_id > 0 && paymentPayload.house_id > 0
    }

    return true
  }, [paymentPayload.house_id, paymentPayload.resident_id, type])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (type === 'residents') {
      await onSubmit(type, residentPayload)
      return
    }

    if (type === 'houses') {
      await onSubmit(type, housePayload)
      return
    }

    if (type === 'payments') {
      await onSubmit(type, paymentPayload)
      return
    }

    await onSubmit(type, expensePayload)
  }

  return (
    <div className="form-modal-root" role="presentation">
      <button type="button" className="form-modal-scrim" aria-label="Tutup form" onClick={onClose} />
      <section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="data-form-title">
        <div className="form-modal-header">
          <div>
            <p className="eyebrow">Input Data</p>
            <h2 id="data-form-title">{formTitles[type]}</h2>
          </div>
          <button type="button" className="form-close-button" onClick={onClose}>Close</button>
        </div>

        <form className="data-form" onSubmit={handleSubmit}>
          {type === 'residents' && (
            <>
              <label>
                Nama Lengkap
                <input
                  value={residentPayload.full_name}
                  onChange={(event) => setResidentPayload((payload) => ({ ...payload, full_name: event.target.value }))}
                  required
                />
              </label>
              <label>
                Nomor Telepon
                <input
                  value={residentPayload.phone_number}
                  onChange={(event) => setResidentPayload((payload) => ({ ...payload, phone_number: event.target.value }))}
                  required
                />
              </label>
              <div className="form-grid-2">
                <label>
                  Status Penghuni
                  <select
                    value={residentPayload.resident_status}
                    onChange={(event) => setResidentPayload((payload) => ({ ...payload, resident_status: event.target.value as ResidentPayload['resident_status'] }))}
                  >
                    <option value="permanent">Tetap</option>
                    <option value="contract">Kontrak</option>
                  </select>
                </label>
                <label>
                  Status Menikah
                  <select
                    value={residentPayload.marital_status}
                    onChange={(event) => setResidentPayload((payload) => ({ ...payload, marital_status: event.target.value as ResidentPayload['marital_status'] }))}
                  >
                    <option value="single">Belum menikah</option>
                    <option value="married">Menikah</option>
                  </select>
                </label>
              </div>
              <label>
                Foto KTP
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(event) => setResidentPayload((payload) => ({ ...payload, ktp_photo: event.target.files?.[0] ?? null }))}
                />
              </label>
            </>
          )}

          {type === 'houses' && (
            <>
              <label>
                Nomor Rumah
                <input
                  value={housePayload.house_number}
                  onChange={(event) => setHousePayload((payload) => ({ ...payload, house_number: event.target.value }))}
                  required
                />
              </label>
              <label>
                Alamat
                <textarea
                  value={housePayload.address ?? ''}
                  onChange={(event) => setHousePayload((payload) => ({ ...payload, address: event.target.value }))}
                  rows={3}
                />
              </label>
              <label>
                Status Rumah
                <select
                  value={housePayload.house_status}
                  onChange={(event) => setHousePayload((payload) => ({ ...payload, house_status: event.target.value as HousePayload['house_status'] }))}
                >
                  <option value="vacant">Tidak dihuni</option>
                  <option value="occupied">Dihuni</option>
                </select>
              </label>
            </>
          )}

          {type === 'payments' && (
            <>
              <div className="form-grid-2">
                <label>
                  Penghuni
                  <select
                    value={paymentPayload.resident_id}
                    onChange={(event) => setPaymentPayload((payload) => ({ ...payload, resident_id: Number(event.target.value) }))}
                    required
                  >
                    <option value={0}>Pilih penghuni</option>
                    {residents.map((resident) => (
                      <option key={resident.id} value={resident.id}>{resident.full_name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Rumah
                  <select
                    value={paymentPayload.house_id}
                    onChange={(event) => setPaymentPayload((payload) => ({ ...payload, house_id: Number(event.target.value) }))}
                    required
                  >
                    <option value={0}>Pilih rumah</option>
                    {houses.map((house) => (
                      <option key={house.id} value={house.id}>{house.house_number}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-grid-2">
                <label>
                  Tanggal Bayar
                  <input
                    type="date"
                    value={paymentPayload.payment_date}
                    onChange={(event) => setPaymentPayload((payload) => ({ ...payload, payment_date: event.target.value }))}
                    required
                  />
                </label>
                <label>
                  Nominal
                  <input
                    type="number"
                    min={1}
                    value={paymentPayload.amount || ''}
                    onChange={(event) => setPaymentPayload((payload) => ({ ...payload, amount: Number(event.target.value) }))}
                    required
                  />
                </label>
              </div>
              <label>
                Metode Pembayaran
                <input
                  value={paymentPayload.payment_method ?? ''}
                  onChange={(event) => setPaymentPayload((payload) => ({ ...payload, payment_method: event.target.value }))}
                />
              </label>
              <label>
                Catatan
                <textarea
                  value={paymentPayload.notes ?? ''}
                  onChange={(event) => setPaymentPayload((payload) => ({ ...payload, notes: event.target.value }))}
                  rows={3}
                />
              </label>
            </>
          )}

          {type === 'expenses' && (
            <>
              <label>
                Kategori Pengeluaran
                <input
                  value={expensePayload.expense_category_name ?? ''}
                  onChange={(event) => setExpensePayload((payload) => ({ ...payload, expense_category_name: event.target.value }))}
                  placeholder="Contoh: Token Listrik"
                />
              </label>
              <div className="form-grid-2">
                <label>
                  Tanggal
                  <input
                    type="date"
                    value={expensePayload.expense_date}
                    onChange={(event) => setExpensePayload((payload) => ({ ...payload, expense_date: event.target.value }))}
                    required
                  />
                </label>
                <label>
                  Nominal
                  <input
                    type="number"
                    min={1}
                    value={expensePayload.amount || ''}
                    onChange={(event) => setExpensePayload((payload) => ({ ...payload, amount: Number(event.target.value) }))}
                    required
                  />
                </label>
              </div>
              <label>
                Deskripsi
                <textarea
                  value={expensePayload.description}
                  onChange={(event) => setExpensePayload((payload) => ({ ...payload, description: event.target.value }))}
                  rows={3}
                  required
                />
              </label>
              <label>
                Bukti
                <input
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={(event) => setExpensePayload((payload) => ({ ...payload, proof: event.target.files?.[0] ?? null }))}
                />
              </label>
            </>
          )}

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
