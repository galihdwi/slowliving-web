import { api } from './api'
import { unwrapJSend } from './jsend'
import type { JSendResponse, PaginatedData, Resident, ResidentPayload } from '@/types/api'

function toResidentFormData(payload: ResidentPayload) {
  const formData = new FormData()
  formData.append('full_name', payload.full_name)
  formData.append('resident_status', payload.resident_status)
  formData.append('phone_number', payload.phone_number)
  formData.append('marital_status', payload.marital_status)

  if (payload.ktp_photo) {
    formData.append('ktp_photo', payload.ktp_photo)
  }

  return formData
}

export const residentService = {
  async list(params?: Record<string, string | number | undefined>) {
    const response = await api.get<JSendResponse<PaginatedData<Resident>>>('/residents', { params })
    return unwrapJSend(response.data)
  },

  async create(payload: ResidentPayload) {
    const response = await api.post<JSendResponse<{ resident: Resident }>>('/residents', toResidentFormData(payload))
    return unwrapJSend(response.data).resident
  },

  async get(id: number) {
    const response = await api.get<JSendResponse<{ resident: Resident }>>(`/residents/${id}`)
    return unwrapJSend(response.data).resident
  },

  async update(id: number, payload: ResidentPayload) {
    const formData = toResidentFormData(payload)
    formData.append('_method', 'PUT')
    const response = await api.post<JSendResponse<{ resident: Resident }>>(`/residents/${id}`, formData)
    return unwrapJSend(response.data).resident
  },
}
