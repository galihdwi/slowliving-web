export type JSendSuccess<T> = {
  status: 'success'
  data: T
}

export type JSendFail = {
  status: 'fail'
  data: unknown
}

export type JSendError = {
  status: 'error'
  message: string
}

export type JSendResponse<T> = JSendSuccess<T> | JSendFail | JSendError

export type Pagination = {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export type PaginatedData<T> = {
  items: T[]
  pagination: Pagination
}

export type User = {
  id: number
  name: string
  email: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token_type: 'Bearer'
  access_token: string
  user: User
}

export type Resident = {
  id: number
  full_name: string
  ktp_photo_url?: string | null
  ktp_photo_path?: string | null
  resident_status: 'permanent' | 'contract'
  phone_number: string
  marital_status: 'single' | 'married'
  created_at?: string
  updated_at?: string
}

export type ResidentPayload = {
  full_name: string
  resident_status: Resident['resident_status']
  phone_number: string
  marital_status: Resident['marital_status']
  ktp_photo?: File | null
}

export type House = {
  id: number
  house_number: string
  address?: string | null
  house_status: 'vacant' | 'occupied'
  created_at?: string
  updated_at?: string
  occupancies?: HouseOccupancy[]
}

export type HouseDetail = {
  houses: House
  occupancy_history: HouseOccupancy[]
  payment_history: Invoice[]
}

export type HousePayload = {
  house_number: string
  address?: string | null
  house_status: House['house_status']
}

export type HouseOccupancy = {
  id: number
  house_id: number
  resident_id: number
  start_date: string
  end_date?: string | null
  notes?: string | null
  resident?: Resident
  house?: House
}

export type HouseOccupancyPayload = {
  resident_id: number
  start_date: string
  end_date?: string | null
  notes?: string | null
}

export type InvoiceItem = {
  id: number
  invoice_id: number
  fee_type_id: number
  description: string
  amount: number | string
}

export type Invoice = {
  id: number
  house_id: number
  resident_id: number
  house_occupancy_id?: number | null
  period_month: string
  due_date?: string | null
  total_amount: number | string
  paid_amount: number | string
  status: 'unpaid' | 'partial' | 'paid'
  house?: House
  resident?: Resident
  items?: InvoiceItem[]
}

export type GenerateInvoicePayload = {
  month?: string
  due_date?: string
}

export type PaymentAllocationPayload = {
  invoice_item_id: number
  amount: number
}

export type PaymentPayload = {
  resident_id: number
  house_id: number
  payment_date: string
  amount: number
  payment_method?: string | null
  notes?: string | null
  allocations?: PaymentAllocationPayload[]
}

export type Payment = PaymentPayload & {
  id: number
  house?: House
  resident?: Resident
  allocations?: Array<{
    id: number
    payment_id: number
    invoice_item_id: number
    amount: number | string
  }>
}

export type ExpensePayload = {
  expense_category_id?: number | null
  expense_category_name?: string | null
  expense_date: string
  amount: number
  description: string
  proof?: File | null
}

export type Expense = {
  id: number
  expense_category_id?: number | null
  expense_date: string
  amount: number | string
  description: string
  proof_path?: string | null
  category?: {
    id: number
    name: string
  } | null
}

export type MonthlySummaryItem = {
  month: string
  income: number
  expense: number
  balance: number
  running_balance: number
}

export type MonthlySummary = {
  year: number
  items: MonthlySummaryItem[]
  ending_balance: number
}

export type MonthlyDetail = {
  month: string
  income_total: number
  expense_total: number
  balance: number
  payments: Payment[]
  expenses: Expense[]
}

export type Totals = {
  income: number
  expense: number
  balance: number
  occupiedHouses: number
}
