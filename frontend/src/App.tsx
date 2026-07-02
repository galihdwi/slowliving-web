import { useState } from 'react'
import { MobileAppBar, Sidebar, Topbar } from '@/components/layout'
import { navigation } from '@/config/navigation'
import { LoginPage } from '@/features/auth'
import { DataFormModal } from '@/features/forms'
import { useAdminData } from '@/hooks/useAdminData'
import { useAuth } from '@/hooks/useAuth'
import { AppRoutes } from '@/routes'
import { expenseService, houseService, paymentService, residentService } from '@/services'
import type { PageKey } from '@/types/admin'
import type { ExpensePayload, HousePayload, PaymentPayload, ResidentPayload } from '@/types/api'
import '@/styles/app.css'

type FormPageKey = Extract<PageKey, 'residents' | 'houses' | 'payments' | 'expenses'>

const formPages: PageKey[] = ['residents', 'houses', 'payments', 'expenses']

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeForm, setActiveForm] = useState<FormPageKey | null>(null)
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
      setActiveForm(activePage as FormPageKey)
    }
  }

  async function handleFormSubmit(
    type: FormPageKey,
    payload: ResidentPayload | HousePayload | PaymentPayload | ExpensePayload,
  ) {
    setIsSubmittingForm(true)
    setFormError(null)

    try {
      if (type === 'residents') {
        await residentService.create(payload as ResidentPayload)
      }

      if (type === 'houses') {
        await houseService.create(payload as HousePayload)
      }

      if (type === 'payments') {
        await paymentService.create(payload as PaymentPayload)
      }

      if (type === 'expenses') {
        await expenseService.create(payload as ExpensePayload)
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
          expenses={adminData.expenses}
          monthlySummary={adminData.monthlySummary}
        />
      </main>

      {activeForm && (
        <DataFormModal
          type={activeForm}
          residents={adminData.residents}
          houses={adminData.houses}
          isSubmitting={isSubmittingForm}
          error={formError}
          onClose={() => setActiveForm(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}

export default App
