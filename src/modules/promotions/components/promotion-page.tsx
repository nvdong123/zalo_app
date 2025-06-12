// src/modules/promotions/components/promotion-page.tsx
import React, { useEffect } from 'react'
import { Box, Text, Button, Icon, useNavigate } from 'zmp-ui'
import { MyHeader } from '@/components/my-header'
import { PromotionCard } from '@/components/promotion-card'
import { usePromotion } from '../use-promotions'
import { useButtonName } from '@/utils/use-button'
import { useOaState } from '@/modules/oa/oa.state'
import { useMerchant } from '@/modules/merchant/use-merchant'
import { useOA } from '@/modules/oa/use-oa'

export function PromotionPage() {
  const {data: promotions, isLoading: promotionsLoading } = usePromotion();
  const {data: buttonName}  = useButtonName()

  const oaActions = useOaState((state) => state.actions)
  const showCount = useOaState((state) => state.showCount)
  const { data: merchant, isLoading: merchantLoading } = useMerchant()
  const { data: merchantOA, refetch } = useOA()

  useEffect(() => {
    const hash = window.location.hash;
    // console.log(hash)
    if (hash) {
      const id = hash.substring(1).split('?')[0];
      // console.log(id)
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    // console.log(showCount)
    // console.log(merchantOA)
    // if (!merchantOA) refetch()
    // if (!merchantOA) return
    // if (merchantOA.followed) return
    // if (showCount > 0) return
    // oaActions.openRequestFollowDialog()
  }, [])

  useEffect(() => {
      if (!merchantOA) return
      if (merchantOA.followed) return
      if (showCount > 0) return
      // console.log('hjhj')
      oaActions.openRequestFollowDialog()
    }, [merchantOA, oaActions, showCount])  

  return (
    <>
      <MyHeader title="Ưu đãi" showBackIcon={true} className="no-divider"/>
      <div className="bg-gray-50" style={{ height: 80 }} />
      <Box className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <Box className="flex-1 p-4">
          <Box className="flex justify-between items-center mb-4">
            <Text.Title>Tất cả</Text.Title>
            {/* <Button 
              variant="tertiary"              
              className="text-green-600"
            >
              <Icon icon='zi-arrow-down' />
              {buttonName?.promotion.sort}
            </Button> */}
          </Box>
          <Box className="space-y-4">
            {promotions?.map((promotion) => (
              <PromotionCard 
                key={promotion.id} 
                promotion={promotion}
            
              />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}