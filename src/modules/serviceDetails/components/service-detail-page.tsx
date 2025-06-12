// src/modules/services/components/service-page.tsx
import React, { Suspense, useEffect, useId, useState } from 'react'
import { Box, Text } from 'zmp-ui'
import { MyHeader } from '@/components/my-header';
// import { ServiceCard } from '@/components/service-card';
import { ServiceDetailsPage } from '@/components/service-detail-card';
import { useService, useServiceDetail, useServiceType } from '../use-services';
import { ChipListRef } from '@/components/chip-list';
import { useOaState } from '@/modules/oa/oa.state';
import { useOA } from '@/modules/oa/use-oa';
const ChipList = React.lazy(() => import('@/components/chip-list'))

export default function ServiceDetailPage() {
  const id = window.location.pathname.split('/').pop();
  // console.log(id)
  const oaActions = useOaState((state) => state.actions)
  const showCount = useOaState((state) => state.showCount)
  const { data: merchantOA } = useOA()

  const {data: service, refetch} = useServiceDetail(id ? id: '1');
  const {data: serviceTypes} = useServiceType();

  // const [servicesDisplay, setServicesDisplay] = useState(services);
  refetch();
  // const id = useId()
  // console.log(service)
  const chipListRef = React.useRef<ChipListRef<React.Key>>(null)
  const scrollingRef = React.useRef<boolean>(false)
  // console.log(service)
  // useEffect(() => {
  //   setServicesDisplay(services)
  // }, [services])

  const options = serviceTypes?.map((item) => ({ label: item.label, value: item.value}))

  useEffect(() => {
    if (!merchantOA) return
    if (merchantOA.followed) return
    if (showCount > 0) return
    // console.log('hjhj')
    oaActions.openRequestFollowDialog()
  }, [merchantOA, oaActions, showCount])  

  return (
    <>
      <MyHeader title="Thông tin chi tiết" showBackIcon={true} className="no-divider"/>
      {/* <div className="bg-gray-50" style={{ height: 130 }} />
      <div className="bg-background fixed left-0 right-0 top-[calc(var(--zaui-safe-area-inset-top)+44px)] z-10 shadow-[0px_0px_0px_1px] shadow-divider overflow-hidden">
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
      {/* <Box className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <Box className='flex-1 p-4'> */}
      <Box className="space-y-4">
      
        <ServiceDetailsPage key={service?.id} {...service} />
      
      </Box>
        {/* </Box>
      </Box> */}
    </>
  )
}