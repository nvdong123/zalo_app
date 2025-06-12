import React from 'react'
import { Page } from 'zmp-ui'

import { PageContainer } from '@/components'
import { LuckywheelTabs, LuckywheelLayout } from '@/modules/luckywheel/components'
import LuckywheelPage from '@/modules/luckywheel/components/luckywheel-page'
import { MyTabs } from '@/components/my-tabs'

export default function BookingRootPage() {
  return (
    <LuckywheelLayout>
      <Page restoreScroll className="bg-background">
        <PageContainer withBottomNav noInsetTop>
          {/* <BookingPage /> */}
          <LuckywheelPage />
        </PageContainer>
      </Page>
      <MyTabs/>
    </LuckywheelLayout>
  )
}
