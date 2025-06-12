import { useQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { Promotion } from '@/types/promotion'

export function usePromotion() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await request<Promotion[]>(`/promotions`)
      return res
    },
  })
}

export function usePromotionSuggest() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await request<Promotion[]>(`/promotions`)
      return res.filter(promotion => promotion.suggest)
    },
  })
}

