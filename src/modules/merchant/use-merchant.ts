import { useQuery } from '@tanstack/react-query'

import { request } from '@/utils/request'

type Merchant = {
  merchantId: string
  name: string
  address: string
  phone: string
  email: string
  zaloId: string
  logoUrl: string
  coverUrl: string
  description: string
  branches?: {
    id: string
    name: string
    address: string
  }[]
  status: 'ACTIVE' | 'INACTIVE'
  visibleOrder: 'DISABLE' | 'ENABLE'
}

type Res = {
  merchant: Merchant
}

export function useMerchant() {
  return useQuery({
    queryKey: ['merchants'],
    queryFn: async () => {
      const res = await request<Res>(`/`)
      return res.merchant
    },
  })
}

export function useMerchantEnableOrder() {
  const { data } = useMerchant()
  return data?.visibleOrder === 'ENABLE'
}
