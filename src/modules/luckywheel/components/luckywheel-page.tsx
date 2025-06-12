// src/modules/services/components/service-page.tsx
import React, { Suspense, useEffect, useId, useState } from 'react'
import { Box, Text } from 'zmp-ui'
import { MyHeader } from '@/components/my-header';
import { LuckyWheelCard } from '@/components/luckywheel-card';
import { useService, useServiceType } from '../use-services';
import { ChipListRef } from '@/components/chip-list';
import { useOaState } from '@/modules/oa/oa.state';
import { useOA } from '@/modules/oa/use-oa';
const ChipList = React.lazy(() => import('@/components/chip-list'))

export default function LuckywheelPage() {
  const {data: services} = useService();
  const {data: serviceTypes} = useServiceType();
  const [servicesDisplay, setServicesDisplay] = useState(services);
  const oaActions = useOaState((state) => state.actions)
  const showCount = useOaState((state) => state.showCount)
  const { data: merchantOA } = useOA()
  const id = useId()

  const chipListRef = React.useRef<ChipListRef<React.Key>>(null)
  const scrollingRef = React.useRef<boolean>(false)

  useEffect(() => {
    setServicesDisplay(services)
  }, [services])

  

  useEffect(() => {
    function onScroll() {
      if (scrollingRef.current) return
      const items = document.querySelectorAll(`.section-wrapper-${CSS.escape(id)}`)
      let middleId = ''
      const middle = window.innerHeight / 2
      items.forEach((item) => {
        const rect = item.getBoundingClientRect()
        if (rect.top < middle && rect.bottom > middle) {
          middleId = item.getAttribute('data-id') || ''
        }
      })
      if (middleId) {
        chipListRef.current?.setActive(Number(middleId))
      }
    }
    const page = document.querySelector('.zaui-page')
    page?.addEventListener('scroll', onScroll)
    return () => {
      page?.removeEventListener('scroll', onScroll)
    }
  }, [id])

  
  useEffect(() => {
    if (!merchantOA) return
    if (merchantOA.followed) return
    if (showCount > 0) return
    // console.log('hjhj')
    oaActions.openRequestFollowDialog()
  }, [merchantOA, oaActions, showCount])  

  const options = serviceTypes?.map((item) => ({ label: item.label, value: item.value}))

  return (
    <>
      <MyHeader title="Quà may mắn" showBackIcon={true} className="no-divider"/>
      <div className="bg-gray-50" style={{ height: 130 }} />
      {/* <div className="bg-background fixed left-0 right-0 top-[calc(var(--zaui-safe-area-inset-top)+44px)] z-10 shadow-[0px_0px_0px_1px] shadow-divider overflow-hidden">
        <Suspense fallback={<div className="h-[48px]" />}>
          <ChipList
            ref={chipListRef}
            className="py-2 bg-background"
            defaultValue={options?.[0]}
            options={options?options:[]}
            onChange={(option) => {
              if (option.value !== "") {
                setServicesDisplay(services?.filter(data => data.type === option.value))
              } else {
                setServicesDisplay(services)
              }
            }}
          />
        </Suspense>
      </div> */}
      <Box className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <Box className='flex-1 p-4'>
          <Box className="space-y-4">            
              <LuckyWheelCard segments={8} colors={['#65BF68', '#ffffff']} spinTime = {5000}/>            
          </Box>
        </Box>
      </Box>
    </>
  )
}