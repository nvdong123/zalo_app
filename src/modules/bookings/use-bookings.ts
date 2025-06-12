// import { useQuery } from '@tanstack/react-query'

// import { request } from '@/utils/request'

// type Booking = {
//   name: string
//   description: string
//   info: string
//   feature: string
// }

// type Res = {
//   booking: Booking
// }

// export function useBooking() {
//   return useQuery({
//     queryKey: ['bookings'],
//     queryFn: async () => {
//       const res = await request<Res>(`/`)
//       return res.booking
//     },
//   })
// }

// export function useMerchantEnableOrder() {
//   const { data } = useMerchant()
//   return data?.visibleOrder === 'ENABLE'
// }

import { useState } from 'react'
import { bookingApi, BookingRequest, BookingResponse } from '@/services/api'

export const useBookings = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (bookingData: BookingRequest) => {
    try {
      setLoading(true)
      setError(null)
      return await bookingApi.create(bookingData)
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đặt phòng')
      throw err
    } finally {
      setLoading(false)
    }
  }

  //   const getUserBookings = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       return await bookingApi.getUserBookings();
  //     } catch (err: any) {
  //       setError(err.message || 'Có lỗi xảy ra khi lấy danh sách đặt phòng');
  //       throw err;
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const cancelBooking = async (bookingId: string) => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       return await bookingApi.cancelBooking(bookingId);
  //     } catch (err: any) {
  //       setError(err.message || 'Có lỗi xảy ra khi hủy đặt phòng');
  //       throw err;
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

    return {
      loading,
      error,
      createBooking,
      // getUserBookings,
      // cancelBooking
    };
}
