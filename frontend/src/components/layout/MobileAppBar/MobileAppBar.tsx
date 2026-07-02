import { HugeiconsIcon } from '@hugeicons/react'
import Menu03Icon from '@hugeicons/core-free-icons/Menu03Icon'
import { appConfig } from '@/config/appConfig'

type MobileAppBarProps = {
  title: string
  isSidebarOpen: boolean
  onOpenSidebar: () => void
}

export function MobileAppBar({ title, isSidebarOpen, onOpenSidebar }: MobileAppBarProps) {
  return (
    <div className="mobile-appbar">
      <button
        type="button"
        className="menu-button"
        aria-label="Buka navigasi"
        aria-expanded={isSidebarOpen}
        onClick={onOpenSidebar}
      >
        <HugeiconsIcon icon={Menu03Icon} size={20} strokeWidth={1.8} />
      </button>
      <div>
        <strong>{appConfig.name}</strong>
        <span>{title}</span>
      </div>
    </div>
  )
}
