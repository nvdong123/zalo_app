import React from 'react'
import { Page } from 'zmp-ui'

import { PageContainer } from '@/components'
import { BookingLayout, BookingTabs, BookingMenuPage } from '@/modules/bookings/components'
import { MyTabs } from '@/components/my-tabs'

export default function BookingRootPage() {
  return (
    <BookingLayout>
      <Page restoreScroll className="bg-background">
        <PageContainer withBottomNav noInsetTop>
          <BookingMenuPage />
        </PageContainer>
      </Page>
      <MyTabs />
    </BookingLayout>
  )
}
