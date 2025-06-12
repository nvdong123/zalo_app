import { useQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { Service, ServiceType } from '@/types/service'

export function useService() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await request<Service[]>(`/services`)
      return res
    },
  })
}

export function useServiceType() {
  return useQuery({
    queryKey: ['service-types'],
    queryFn: async () => {
      const res = await request<ServiceType[]>(`/service-types`)
      return res
    },
  })
}
