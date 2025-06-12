import React, { useState } from 'react'
import { BottomNavigation, useNavigate } from 'zmp-ui'

import { Badge } from '@/components'
import { IconCookPotSolid, IconNoteSolid } from '@/components/icons'
import { IconRestaurant } from '@/components/icons/icon-restaurant'
import {} from '@/components/icons/'
import { Routes } from '@/constants/routes'
import { IconPhoneCall } from '@/components/icons/icon-phone-call'
import { IconWhatApps } from '@/components/icons/icon-what-apps'
import { IconHomePage } from '@/components/icons/icon-home-page'
import { IconSimpleZalo } from '@/components/icons/icon-simple-zalo'
import { IconDirection } from '@/components/icons/icon-direction'
import { IconPercentage } from '@/components/icons/icon-percentage'

// import { useMerchant, useMerchantEnableOrder } from '../use-merchant'

type MenuType = 'service' | 'promotion' | 'info' | 'luckywheel' | 'booking'

export function BookingTabs({ activeTab }: { activeTab: MenuType }) {
  const navigate = useNavigate()
  // const { isLoading } = useMerchant()
  // const enableOrder = useMerchantEnableOrder()
  // const total = useTotalCartItems()

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

  // if (isLoading) return null

  return (
    <BottomNavigation fixed activeKey={tab} onChange={handleTabChange}>
      {/* <BottomNavigation.Item key="menu" label="Menu" icon={<IconNoteSolid />} /> */}
      {/* {enableOrder && (
        <BottomNavigation.Item
          className="z-10"
          label="Món đang chọn"
          key="orders"
          icon={
            total > 0 ? (
              <Badge label={String(total)}>
                <IconCookPotSolid />
              </Badge>
            ) : (
              <IconCookPotSolid />
            )
          }
        />
      )} */}
      {/* <BottomNavigation.Item key="info" label="Nhà hàng" icon={<IconRestaurant />} /> */}

      <BottomNavigation.Item key="callnow" label="Gọi ngay" icon={<IconPhoneCall />} />
      <BottomNavigation.Item key="promotions" label="Ưu đãi" icon={<IconPercentage />} />
      <BottomNavigation.Item key="homepage" label="Trang chủ" icon={<IconHomePage />} />
      <BottomNavigation.Item key="simplezalo" label="Tin nhắn" icon={<IconSimpleZalo />} />
      <BottomNavigation.Item key="direction" label="Chỉ đường" icon={<IconDirection />} />
    </BottomNavigation>
  )
}
