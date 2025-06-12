import React, { Suspense, useEffect, useId } from 'react'
import { Header, Text } from 'zmp-ui'

import { ChipListRef } from '@/components/chip-list'
import { MerchantNotFoundError } from '@/constants/errors'

import { useMerchant } from '../use-merchant'
import { MenuEmpty } from './menu-empty'
import { MerchantMenuPageLoading } from './merchant-menu-page-loading'

const ChipList = React.lazy(() => import('@/components/chip-list'))

export function MerchantMenuPage() {
  const { data: merchant, isLoading: merchantLoading } = useMerchant()

  const id = useId()

  const isLoading = merchantLoading

  const chipListRef = React.useRef<ChipListRef<React.Key>>(null)
  const scrollingRef = React.useRef<boolean>(false)
  const scrollingTimeout = React.useRef<ReturnType<typeof setTimeout>>()

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

  if (isLoading) return <MerchantMenuPageLoading />
  if (!merchant ) throw new MerchantNotFoundError()


  return (
    <div>
      <Header title={merchant.name} showBackIcon={false} className="no-divider" />
      <div className="bg-background fixed left-0 right-0 top-[calc(var(--zaui-safe-area-inset-top)+44px)] z-10 shadow-[0px_0px_0px_1px] shadow-divider overflow-hidden">
        <Suspense fallback={<div className="h-[48px]" />}>
          <ChipList
            ref={chipListRef}
            className="py-2 bg-background"
            options={[]}
            onChange={(option) => {
              const page = document.querySelector('.zaui-page')
              const el = document.getElementById(`section-${id}-${option.value}`)
              scrollingRef.current = true
              clearTimeout(scrollingTimeout.current)
              if (page && el) {
                page.scrollTo({
                  top: el.offsetTop - 152,
                  behavior: 'smooth',
                })
              }
              scrollingTimeout.current = setTimeout(() => {
                scrollingRef.current = false
              }, 1500)
            }}
          />
        </Suspense>
      </div>
      <div style={{ height: 90 }} />
      <MenuEmpty />
      <div className="bg-white" style={{ height: 48 }} />
    </div>
  )
}
