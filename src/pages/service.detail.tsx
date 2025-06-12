import React from 'react'
import { Page } from 'zmp-ui'

import { PageContainer } from '@/components'
import { ServiceDetailLayout , ServiceDetailTabs } from '@/modules/serviceDetails/components'
import ServiceDetailPage from '@/modules/serviceDetails/components/service-detail-page'
import { MyTabs } from '@/components/my-tabs'

export default function BookingRootPage() {
  return (
    <ServiceDetailLayout>
      <Page restoreScroll className="bg-background">
        <PageContainer withBottomNav noInsetTop>
          {/* <BookingPage /> */}
          <ServiceDetailPage />
        </PageContainer>
      </Page>
      <MyTabs />
    </ServiceDetailLayout>
  )
}
