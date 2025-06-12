import React, { useState } from 'react'
import { BottomNavigation, useNavigate } from 'zmp-ui'
import {} from '@/components/icons/'
import { Routes } from '@/constants/routes'
import { IconPhoneCall } from '@/components/icons/icon-phone-call'
import { IconWhatApps } from '@/components/icons/icon-what-apps'
import { IconHomePage } from '@/components/icons/icon-home-page'
import { IconSimpleZalo } from '@/components/icons/icon-simple-zalo'
import { IconDirection } from '@/components/icons/icon-direction'
import { IconPercentage } from '@/components/icons/icon-percentage'

type MenuType = 'service' | 'promotion' | 'info' | 'luckywheel'

export function LuckywheelTabs({ activeTab }: { activeTab: MenuType }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState(activeTab)

  function handleTabChange(tab: string) {
    setTab(tab as MenuType)
    let url = Routes.merchant.page()
    switch (tab) {
      case 'info':
        url = Routes.merchant.info()
        break
      case 'booking':
        url = Routes.merchant.booking()
      case 'service':
        url = Routes.merchant.service()
      case 'luckywheel':
        url = Routes.merchant.luckywheel()

      case 'promotion':
        url = Routes.merchant.promotion()
      default:
        break
    }
    navigate(url, { animate: false, replace: true })
  }

  return (
    <BottomNavigation fixed activeKey={tab} onChange={handleTabChange}>
      <BottomNavigation.Item key="callnow" label="Gọi ngay" icon={<IconPhoneCall />} />
      <BottomNavigation.Item key="promotions" label="Ưu đãi" icon={<IconPercentage />} />
      <BottomNavigation.Item key="homepage" label="Trang chủ" icon={<IconHomePage />} />
      <BottomNavigation.Item key="simplezalo" label="Tin nhắn" icon={<IconSimpleZalo />} />
      <BottomNavigation.Item key="direction" label="Chỉ đường" icon={<IconDirection />} />
    </BottomNavigation>
  )
}
