import React from 'react'

import { SvgIconProps } from './types'

export function IconWifi({ size = 24, ...props }: SvgIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 9.48256C2.29171 9.20574 2.5948 8.94118 2.9085 8.68956C8.5185 4.18706 16.691 4.45156 22 9.48256" stroke="#2F8A3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19 12.8995C15.134 9.0335 8.866 9.0335 5 12.8995M16 16.157C13.791 13.9475 10.209 13.9475 8 16.157" stroke="#2F8A3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.7071 19.4571C12.5196 19.6446 12.2652 19.75 12 19.75C11.7348 19.75 11.4804 19.6446 11.2929 19.4571C11.1054 19.2696 11 19.0152 11 18.75C11 18.4848 11.1054 18.2304 11.2929 18.0429C11.4804 17.8554 11.7348 17.75 12 17.75C12.2652 17.75 12.5196 17.8554 12.7071 18.0429C12.8946 18.2304 13 18.4848 13 18.75C13 19.0152 12.8946 19.2696 12.7071 19.4571Z" stroke="#2F8A3A" stroke-width="0.5"/>
    </svg>
  )
}