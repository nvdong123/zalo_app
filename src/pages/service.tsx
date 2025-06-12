import React from 'react'
import { Page } from 'zmp-ui'

import { PageContainer } from '@/components'
import { ServiceLayout , ServiceTabs } from '@/modules/services/components'
import ServicePage from '@/modules/services/components/service-page'
import { MyTabs } from '@/components/my-tabs'

export default function BookingRootPage() {
  return (
    <ServiceLayout>
      <Page restoreScroll className="bg-background">
        <PageContainer withBottomNav noInsetTop>
          {/* <BookingPage /> */}
          <ServicePage />
        </PageContainer>
      </Page>
      <MyTabs />
    </ServiceLayout>
  )
}
