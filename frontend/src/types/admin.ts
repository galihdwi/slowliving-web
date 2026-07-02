import type { IconSvgElement } from '@hugeicons/react'

export type PageKey = 'dashboard' | 'residents' | 'houses' | 'payments' | 'expenses' | 'reports'

export type NavigationItem = {
  key: PageKey
  label: string
  hint: string
  icon: IconSvgElement
}

export type MonthlyReport = {
  month: string
  income: number
  expense: number
}

export type ResidentRow = {
  name: string
  house: string
  status: string
  phone: string
}

export type HouseRow = {
  number: string
  resident: string
  status: 'Dihuni' | 'Tidak dihuni'
  since: string
}

export type ActivityRow = {
  date: string
  type: 'Pemasukan' | 'Pengeluaran'
  note: string
  amount: number
}

export type Totals = {
  income: number
  expense: number
  balance: number
  occupiedHouses: number
}
