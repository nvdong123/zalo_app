import { useQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { ButtonName } from '@/types/button-name'

export function useButtonName() {
    return useQuery({
      queryKey: ['button-name'],
      queryFn: async () => {
        const res = await request<ButtonName>(`/button-name`)
        return res
      },
    })
  }