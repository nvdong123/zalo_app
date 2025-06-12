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
import { openPhone, openWebview, openChat } from 'zmp-sdk/apis'
import { useQuery } from '@tanstack/react-query'

import { request } from '@/utils/request'

import { useOA } from '@/modules/oa/use-oa'

import { useButtonName } from '@/utils/use-button'


// import { useMerchant, useMerchantEnableOrder } from '../use-merchant'



type Tab = {
  phonenumber: string
  prompt: string
  direction_link: string,
  OA_id: string
}


function useTabs() {
  return useQuery({
    queryKey: ['tabs'],
    queryFn: async () => {
      const res = await request<Tab>(`/tabs`)
      // console.log(res)
      return res
    },
  })
}

// useTabs()
// const {data: tabInfo} = useTabs()
// console.log(tabInfo)

type MenuType = 'promotion' | 'direction' | 'homepage' | 'callnow' | 'zaloinbox'

const openCallScreen = async (phone_number?: string) => {
  try {
    await openPhone({
      phoneNumber: phone_number ? phone_number : '',
    });
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

const openUrlInWebview = async (link?: string) => {
  try {
    await openWebview({
      url: link ? link : '',
      config: {
        style: "bottomSheet",
        leftButton: "back",
      },
    });
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

const openChatScreen = async (OA_id?: string, msg?: string) => {
  try {
    await openChat({
      type: "oa",
      id: OA_id ? OA_id : '',
      message: msg,
    });
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export function MyTabs({ activeTab }: { activeTab?: MenuType }) {
  const { data: tabs } = useTabs()
  const { data: OAInfo} = useOA()
  const { data: buttonName } = useButtonName()
  // console.log(OAInfo.oa)
  const navigate = useNavigate()
  // const { isLoading } = useMerchant()
  const [tab, setTab] = useState(activeTab)

    function handleTabChange(tab: string) {
      // console.log(tab)
        setTab(tab as MenuType)
        // console.log(tab)
        let url = Routes.merchant.page()
        switch (tab) {
          case 'homepage':
            url = Routes.merchant.homepage()
            break
          case 'callnow':
            openCallScreen(OAInfo?.oa.phone)
            return
          case 'zaloinbox':
            openChatScreen(OAInfo?.oa.id, OAInfo?.oa.prompt)
            return
          case 'direction':
            openUrlInWebview(OAInfo?.oa.direction_link)
            return
          case 'promotion':
            url = Routes.merchant.promotion()
          default:
            break
        }
        navigate(url, { animate: false, replace: false })
      }

  // if (isLoading) return null

  return (
    <BottomNavigation fixed activeKey={tab} defaultActiveKey='undefined'>
    <BottomNavigation.Item key="undefined" label="Chat" style={{display: 'none'}}/>
    <BottomNavigation.Item key="callnow" label={buttonName?.tab.callnow} icon={<IconPhoneCall />} onClick={() => handleTabChange('callnow')}/>
    <BottomNavigation.Item key="promotion" label={buttonName?.tab.promotion} icon={<IconPercentage />} onClick={() => handleTabChange('promotion')}/>
    <BottomNavigation.Item key="homepage" label={buttonName?.tab.homepage} icon={<IconHomePage />} onClick={() => handleTabChange('homepage')}/>
    <BottomNavigation.Item key="zaloinbox" label={buttonName?.tab.inbox} icon={<IconSimpleZalo />} onClick={() => handleTabChange('zaloinbox')}/>
    <BottomNavigation.Item key="direction" label={buttonName?.tab.direction} icon={<IconDirection />} onClick={() => handleTabChange('direction')}/>
    </BottomNavigation>
  )
}
