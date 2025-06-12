// src/modules/services/components/service-page.tsx
import React, { Suspense, useEffect, useId, useState } from 'react'
import { Box, Text } from 'zmp-ui'
import { MyHeader } from '@/components/my-header';
import { ServiceCard } from '@/components/service-card';
import { useService, useServiceType } from '../use-services';
import { ChipListRef } from '@/components/chip-list';

const ChipList = React.lazy(() => import('@/components/chip-list'))

export default function ServicePage() {
  const {data: services} = useService();
  const {data: serviceTypes} = useServiceType();
  const [servicesDisplay, setServicesDisplay] = useState(services);

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

  const options = serviceTypes?.map((item) => ({ label: item.label, value: item.value}))

  return (
    <>
      <MyHeader title="Dịch vụ" showBackIcon={true} className="no-divider"/>
      <div className="bg-gray-50" style={{ height: 130 }} />
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
      </div>
      <Box className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <Box className='flex-1 p-4'>
          <Box className="space-y-4">
            {servicesDisplay?.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}