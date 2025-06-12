import React from 'react'

import { FollowOaDialog } from '@/modules/oa/components'

export function LuckywheelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FollowOaDialog />
    </>
  )
}
