import React from 'react'
import { Page } from 'zmp-ui'

import { PageContainer } from '@/components'
import { MerchantLayout, MerchantPage, MerchantTabs } from '@/modules/merchant/components'
import { MyTabs } from '@/components/my-tabs'
import Sidebar from '@/components/side-bar'

export default function MerchantInfoPage() {
  return (
    <MerchantLayout>

      <Page restoreScroll className="bg-background">
        <PageContainer withBottomNav noInsetTop>
          <MerchantPage />
        </PageContainer>
      </Page>
      
      {/* <Sidebar isOpen={sideBarOpen}  /> */}
      <MyTabs activeTab="homepage" />
    </MerchantLayout>
  )
}
