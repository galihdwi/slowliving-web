import { api } from './api'
import { unwrapJSend } from './jsend'
import type { House, HouseOccupancy, HouseOccupancyPayload, HousePayload, JSendResponse, PaginatedData } from '@/types/api'

export const houseService = {
  async list(params?: Record<string, string | number | undefined>) {
    const response = await api.get<JSendResponse<PaginatedData<House>>>('/houses', { params })
    return unwrapJSend(response.data)
  },

  async create(payload: HousePayload) {
    const response = await api.post<JSendResponse<{ houses: House }>>('/houses', payload)
    return unwrapJSend(response.data).houses
  },

  async get(id: number) {
    const response = await api.get<JSendResponse<{ houses: House }>>(`/houses/${id}`)
    return unwrapJSend(response.data).houses
  },

  async update(id: number, payload: HousePayload) {
    const response = await api.put<JSendResponse<{ houses: House }>>(`/houses/${id}`, payload)
    return unwrapJSend(response.data).houses
  },

  async createOccupancy(houseId: number, payload: HouseOccupancyPayload) {
    const response = await api.post<JSendResponse<{ occupancy: HouseOccupancy }>>(`/houses/${houseId}/occupancies`, payload)
    return unwrapJSend(response.data).occupancy
  },
}
