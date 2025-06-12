// src/types/service.ts
// export enum ServiceType {
//   RESTAURANT = 'restaurant',
//   SPA = 'spa',
//   TOUR = 'tour',
//   ACTIVITY = 'activity'
// }
  
export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

export interface ServiceDiscount {
  percentage: number
  startDate?: Date
  endDate?: Date
  description?: string
}

export interface ServiceImage {
  id: string
  url: string
  alt?: string
  isMain: boolean
}

export interface ServiceReview {
  id: string
  rating: number
  comment?: string
  userId: string
  createdAt: Date
}

export interface ServiceType {
  id: string
  label: string
  value: string
}

export interface Service {
  id: string
  name: string
  description: string
  status: ServiceStatus
  type: string
  price: number
  discount?: string
  rating: number
  totalReviews?: number
  thumbnail: string
  benefits: string[]
  images: string[]
  // images: ServiceImage[]
  features?: string[]
  capacity?: number // Số lượng khách có thể phục vụ
  duration?: number // Thời gian dịch vụ (phút)
  location?: string
  bookingUrl?: string
  reviews?: ServiceReview[]
  createdAt: Date
  updatedAt: Date
}

export interface ServiceDetails {
  id?: string;
  name?: string;
  description?: string;
  images?: string[];
  benefits?: string[]
}

// Response type cho API
export interface ServiceResponse {
  data: Service[]
  total: number
  page: number
  limit: number
}

// Request type cho filtering/sorting
// export interface ServiceFilterParams {
//   type?: ServiceType
//   minPrice?: number
//   maxPrice?: number
//   minRating?: number
//   search?: string
//   sortBy?: 'price' | 'rating' | 'name'
//   sortOrder?: 'asc' | 'desc'
//   page?: number
//   limit?: number
// }

// Type cho booking service
export interface ServiceBooking {
  serviceId: string
  userId: string
  date: Date
  time: string
  numberOfPeople?: number
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
}