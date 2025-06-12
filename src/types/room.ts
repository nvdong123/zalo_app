export enum AmenityIcon {
  Booking = "icon-booking",
  CafeTea = "icon-cafe-tea",
  CookPot = "icon-cook-pot",
  Direction = "icon-direction",
  Dryer = "icon-dryer",
  HomePage = "icon-home-page",
  LcdTv = "icon-lcd-tv",
  Location = "icon-location",
  Minibar = "icon-minibar",
  Minigame = "icon-minigame",
  Minus = "icon-minus",
  Note = "icon-note",
  OaVerified = "icon-oa-verified",
  Percentage = "icon-percentage",
  PhoneCall = "icon-phone-call",
  PostNotif = "icon-post-notif",
  Restaurant = "icon-restaurant",
  RoomService = "icon-room-service",
  Security = "icon-security",
  Service = "icon-service",
  ShoppingCart = "icon-shopping-cart",
  SimpleZalo = "icon-simple-zalo",
  Star = "icon-star",
  Vault = "icon-vault",
  WhatApps = "icon-what-apps",
  Wifi = "icon-wifi"
}

export interface Amenity {
  id: string,
  name: string,
  type: string
}

export interface RoomImage {
  src: string
  alt: string
  title: string
}

export interface Room {
  id: string
  name: string
  price: string
  vrUrl?: string
  images?: RoomImage[]
  characters: string[]
  introduction: string
  utilities: Amenity[],
  VRURL: string,
  VideoURL: string
}
  