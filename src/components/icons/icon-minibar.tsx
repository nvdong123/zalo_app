import React from 'react'

import { SvgIconProps } from './types'

export function IconMinibar({ size = 24, ...props }: SvgIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 3H4.5C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3Z" stroke="#2F8A3A" stroke-width="2" stroke-linejoin="round"/>
    <path d="M3 8H21M3 6.5V9.5M21 6.5V9.5" stroke="#2F8A3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}