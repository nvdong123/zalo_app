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

export function useServiceDetail(id: string) {
  return useQuery({
    queryKey: ['servicesdetail'],
    queryFn: async () => {
      const res = await request<Service[]>(`/services`)
      // console.log(res)
      // console.log(id)
      const filtered = res.filter((service) => {
        // console.log(service.id.toString())
        // console.log(id)
        return service.id.toString() === id
      })
      // console.log(filtered)
      return filtered[0]
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
