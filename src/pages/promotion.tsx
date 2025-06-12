import React from 'react'
import { Page } from 'zmp-ui'

import { PageContainer } from '@/components'
import { PromotionPage, PromotionLayout , PromotionTabs } from '@/modules/promotions/components'
import { MyTabs } from '@/components/my-tabs'

export default function BookingRootPage() {
  return (
    <PromotionLayout>
      <Page restoreScroll className="bg-background">
        <PageContainer withBottomNav noInsetTop>
          <PromotionPage />
        </PageContainer>
      </Page>
      <MyTabs activeTab="promotion" />
    </PromotionLayout>
  )
}
