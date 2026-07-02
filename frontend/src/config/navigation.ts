import AddMoneyCircleIcon from '@hugeicons/core-free-icons/AddMoneyCircleIcon'
import ChartBarLineIcon from '@hugeicons/core-free-icons/ChartBarLineIcon'
import Home07Icon from '@hugeicons/core-free-icons/Home07Icon'
import House05Icon from '@hugeicons/core-free-icons/House05Icon'
import MoneySend02Icon from '@hugeicons/core-free-icons/MoneySend02Icon'
import UserGroupIcon from '@hugeicons/core-free-icons/UserGroupIcon'
import type { NavigationItem } from '@/types/admin'

export const navigation: NavigationItem[] = [
  { key: 'dashboard', label: 'Dashboard', hint: 'Ringkasan kas', icon: Home07Icon },
  { key: 'residents', label: 'Penghuni', hint: 'Data warga', icon: UserGroupIcon },
  { key: 'houses', label: 'Rumah', hint: 'Unit hunian', icon: House05Icon },
  { key: 'payments', label: 'Pembayaran', hint: 'Kas masuk', icon: AddMoneyCircleIcon },
  { key: 'expenses', label: 'Pengeluaran', hint: 'Kas keluar', icon: MoneySend02Icon },
  { key: 'reports', label: 'Laporan', hint: 'Analitik', icon: ChartBarLineIcon },
]
