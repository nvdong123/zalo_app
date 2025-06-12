import React from 'react'
import { Page } from 'zmp-ui'

import { PageContainer } from '@/components'
import { MerchantLayout, MerchantMenuPage, MerchantTabs } from '@/modules/merchant/components'
import { MyTabs } from '@/components/my-tabs'

export default function MerchantRootPage() {
  return (
    <MerchantLayout>
      <Page restoreScroll>
        <PageContainer withBottomNav>
          <MerchantMenuPage />
        </PageContainer>
      </Page>
      <MyTabs />
    </MerchantLayout>
  )
}
