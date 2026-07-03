import { useState } from 'react'
import { MobileAppBar, Sidebar, Topbar } from '@/components/layout'
import { navigation } from '@/config/navigation'
import { LoginPage } from '@/features/auth'
import { DataFormModal, OccupancyFormModal } from '@/features/forms'
import { useAdminData } from '@/hooks/useAdminData'
import { useAuth } from '@/hooks/useAuth'
import { AppRoutes } from '@/routes'
import { expenseService, houseService, paymentService, residentService } from '@/services'
import type { PageKey } from '@/types/admin'
import type { Expense, ExpensePayload, House, HouseOccupancyPayload, HousePayload, PaymentPayload, Resident, ResidentPayload } from '@/types/api'
import '@/styles/app.css'

type FormPageKey = Extract<PageKey, 'residents' | 'houses' | 'payments' | 'expenses'>
type ActiveFormState = {
  type: FormPageKey
  mode: 'create' | 'edit'
  record?: Resident | House | Expense
}

const formPages: PageKey[] = ['residents', 'houses', 'payments', 'expenses']

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeForm, setActiveForm] = useState<ActiveFormState | null>(null)
  const [activeOccupancyHouse, setActiveOccupancyHouse] = useState<House | null>(null)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const auth = useAuth()
  const adminData = useAdminData(auth.isAuthenticated)

  const currentNav = navigation.find((item) => item.key === activePage) ?? navigation[0]

  function selectPage(page: PageKey) {
    setActivePage(page)
    setIsSidebarOpen(false)
  }

  function openActiveForm() {
    if (formPages.includes(activePage)) {
      setFormError(null)
      setActiveForm({ type: activePage as FormPageKey, mode: 'create' })
    }
  }

  function openEditForm(type: FormPageKey, record: Resident | House | Expense) {
    setFormError(null)
    setActiveForm({ type, mode: 'edit', record })
  }

  async function handleFormSubmit(
    type: FormPageKey,
    payload: ResidentPayload | HousePayload | PaymentPayload | ExpensePayload,
  ) {
    setIsSubmittingForm(true)
    setFormError(null)

    try {
      if (type === 'residents') {
        if (activeForm?.mode === 'edit' && activeForm.record) {
          await residentService.update(activeForm.record.id, payload as ResidentPayload)
        } else {
          await residentService.create(payload as ResidentPayload)
        }
      }

      if (type === 'houses') {
        if (activeForm?.mode === 'edit' && activeForm.record) {
          await houseService.update(activeForm.record.id, payload as HousePayload)
        } else {
          await houseService.create(payload as HousePayload)
        }
      }

      if (type === 'payments') {
        await paymentService.create(payload as PaymentPayload)
      }

      if (type === 'expenses') {
        if (activeForm?.mode === 'edit' && activeForm.record) {
          await expenseService.update(activeForm.record.id, payload as ExpensePayload)
        } else {
          await expenseService.create(payload as ExpensePayload)
        }
      }

      setActiveForm(null)
      await adminData.refresh()
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Gagal menyimpan data.'
      setFormError(message)
    } finally {
      setIsSubmittingForm(false)
    }
  }

  async function handleOccupancySubmit(houseId: number, payload: HouseOccupancyPayload) {
    setIsSubmittingForm(true)
    setFormError(null)

    try {
      await houseService.createOccupancy(houseId, payload)
      setActiveOccupancyHouse(null)
      await adminData.refresh()
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Gagal menyimpan penghuni rumah.'
      setFormError(message)
    } finally {
      setIsSubmittingForm(false)
    }
  }

  if (auth.isBooting) {
    return <div className="screen-loader">Memuat sesi...</div>
  }

  if (!auth.isAuthenticated) {
    return <LoginPage isLoading={auth.isLoading} error={auth.error} onLogin={auth.login} />
  }

  return (
    <div className={isSidebarOpen ? 'app-shell sidebar-open' : 'app-shell'}>
      <a className="skip-link" href="#main-content">Lewati ke konten</a>
      <button
        type="button"
        className="sidebar-scrim"
        aria-label="Tutup navigasi"
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar activePage={activePage} onSelectPage={selectPage} onClose={() => setIsSidebarOpen(false)} />

      <main className="main-panel" id="main-content">
        <MobileAppBar
          title={currentNav.label}
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        <Topbar
          title={currentNav.label}
          subtitle={currentNav.hint}
          userName={auth.user?.name}
          canAdd={formPages.includes(activePage)}
          onAdd={openActiveForm}
          onLogout={auth.logout}
        />

        {adminData.error && (
          <div className="alert-panel">
            <strong>Gagal mengambil data.</strong>
            <span>{adminData.error}</span>
            <button type="button" onClick={adminData.refresh}>Coba lagi</button>
          </div>
        )}

        {adminData.isLoading && <div className="inline-loader">Mengambil data backend...</div>}

        <AppRoutes
          activePage={activePage}
          totals={adminData.totals}
          residents={adminData.residents}
          houses={adminData.houses}
          payments={adminData.payments}
          invoices={adminData.invoices}
          expenses={adminData.expenses}
          monthlySummary={adminData.monthlySummary}
          onEditResident={(resident) => openEditForm('residents', resident)}
          onEditHouse={(house) => openEditForm('houses', house)}
          onEditExpense={(expense) => openEditForm('expenses', expense)}
          onManageOccupancy={(house) => {
            setFormError(null)
            setActiveOccupancyHouse(house)
          }}
        />
      </main>

      {activeForm && (
        <DataFormModal
          key={`${activeForm.type}-${activeForm.mode}-${activeForm.record?.id ?? 'new'}`}
          type={activeForm.type}
          mode={activeForm.mode}
          initialData={activeForm.record ?? null}
          residents={adminData.residents}
          houses={adminData.houses}
          isSubmitting={isSubmittingForm}
          error={formError}
          onClose={() => setActiveForm(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {activeOccupancyHouse && (
        <OccupancyFormModal
          key={activeOccupancyHouse.id}
          house={activeOccupancyHouse}
          residents={adminData.residents}
          isSubmitting={isSubmittingForm}
          error={formError}
          onClose={() => setActiveOccupancyHouse(null)}
          onSubmit={handleOccupancySubmit}
        />
      )}
    </div>
  )
}

export default App
