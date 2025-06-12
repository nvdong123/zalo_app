import { useQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { Room } from '@/types/room'

export function useRoom() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await request<Room[]>(`/rooms`)
      return res
    },
  })
}
