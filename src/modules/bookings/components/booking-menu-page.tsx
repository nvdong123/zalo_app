// src/modules/bookings/components/booking-menu-page.tsx
import React, { useEffect, useId, useState} from 'react';
import { Box, useSnackbar } from 'zmp-ui';
import { ChipListRef } from '@/components/chip-list';
import { MyHeader } from '@/components/my-header';
import { RoomCard } from '@/components/room-card';
import { useRoom } from '../use-rooms';
import { Room } from '@/types/room';
import { openWebview } from 'zmp-sdk/apis';


export function BookingMenuPage() {
  const {data: rooms, isLoading: roomsLoading } = useRoom();
  const snackbar = useSnackbar();
  
  const id = useId();

  const chipListRef = React.useRef<ChipListRef<React.Key>>(null)
  const scrollingRef = React.useRef<boolean>(false)

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

  // const handleBooking = async () => {
  //   try {
  //     // Lấy thông tin user từ Zalo Mini App SDK
  //     const userInfo = await getUserInfo();
  //     // Tạo booking
  //     const response = await createBooking(userInfo, room);
  //     console.log('Booking response:', response);
      
  //     // Chuyển đến trang xác nhận đặt phòng với thông tin cần thiết
  //     // navigate('/booking/confirm', {
  //     //   state: {
  //     //     room,
  //     //     userInfo,
  //     //     bookingInfo: {
  //     //       checkIn: null, // Sẽ chọn ở trang confirm
  //     //       checkOut: null,
  //     //       guests: 1
  //     //     }
  //     //   }
  //     // });      
  //   } catch (error : any) {
  //     console.error('Booking error details:', error);
  //     snackbar.openSnackbar({
  //       type: 'error',
  //       text: error.message || 'Có lỗi xảy ra, vui lòng thử lại'
  //     });
  //   }
  // };

  const handleViewVR = async (room: Room) => {
    // Xử lý xem phòng VR360
    try {
      await openWebview({
        url: room.vrUrl? room.vrUrl : '',
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  return (
    <>
      <MyHeader title={"Thông tin phòng"} showBackIcon={true} className="no-divider"/>
      <div className="bg-gray-50" style={{ height: 80 }} />
      <Box className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <Box className='flex-1 p-4'>
          <Box className="space-y-4">
            {rooms?.map((room, index) => (
              <RoomCard room={room} />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}
