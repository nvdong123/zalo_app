import React from 'react'

import { SvgIconProps } from './types'

export function IconBooking({ size = 24, ...props }: SvgIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.25 14.365V3.11499H14.5V14.365H3.25ZM3.25 16.865H14.5V28.115H3.25V16.865ZM17 3.11499V14.365H28.25V3.11499H17ZM17 28.115V16.865H28.25V28.115H17Z" fill="#2F8A3A"/>
    </svg>
  )
}