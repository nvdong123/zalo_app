// src/modules/bookings/components/room-card.tsx
import React from 'react';
import { Box, Button, Grid, Center, Cluster, useSnackbar } from 'zmp-ui';
import { Linking } from 'react-native';
import { getUserInfo, openWebview, requestSendNotification, showFunctionButtonWidget } from 'zmp-sdk/apis';
import { useNavigate } from 'react-router-dom';
import { Room } from '@/types/room';
import { AmenityIcon } from '@/types/room';
import { Icon } from './my-icon';
import { ImageCarousel } from './image-carousel';
import { notificationApi, bookingApi } from '@/services/api';
import { useOA } from '@/modules/oa/use-oa'
import { useButtonName } from '@/utils/use-button'
import SharePopup from './share-popup';

interface RoomCardProps {
  room: Room
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();  
  const { data: merchantOA } = useOA()
  const { data: buttonName } = useButtonName()

  const createBooking = async (userInfo: any, room: any) => {
    try {
      // Hiển thị loading
      await snackbar.openSnackbar({
        type: 'info',
        text: 'Đang xử lý ...!'
      });
  
      // Lấy ngày hiện tại cho check_in và check_out
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      // Tạo booking data theo đúng BE schema
      // const bookingData = {
      //   hotel_id: room.hotel_id, // ID của khách sạn
      //   room_id: '123',
      //   user_id: userInfo.userInfo.id, // ID của khách hàng
      //   check_in: today.toISOString(), // Ngày check-in
      //   check_out: tomorrow.toISOString(), // Ngày check-out
      //   rooms: [room.id], // Array room IDs
      //   guest_name: userInfo.userInfo.name,
      //   guest_email: userInfo.userInfo.email || null,
      //   guest_phone: userInfo.userInfo.phoneNumber || '',
      //   adult_count: 1, // Số người lớn mặc định
      //   children_count: 0, // Số trẻ em mặc định
      //   special_requests: '', // Yêu cầu đặc biệt
      //   note: '', // Ghi chú
      //   zalo_id: userInfo.userInfo.id, // ID Zalo của người dùng
      //   initial_price: room.price // Giá phòng
      // };
  
      // Gọi API tạo booking
      // console.log(bookingData)
      // const response = await bookingApi.createBooking(bookingData);
      // console.log('Booking response:', response);

      await notificationApi.sendRoomNotification({
        merchantOA,
        userId: userInfo.userInfo.id,
        customerName: userInfo.userInfo.name,
        bookingNumber: "BK123456",
        bookingNote: "Đặt phòng Deluxe - 2 người lớn",
        roomName: room.name
      });
  
      // Gửi notification template qua Zalo OA
      // await requestSendNotification({
      //   templateId: 'booking_confirmation',
      //   templateData: {
      //     room_name: room.name,
      //     price: room.price.toLocaleString(),
      //     booking_id: '123',
      //     hotel_name: room.hotel_name || 'ADAZ Hotel Resort',
      //     check_in: today.toLocaleDateString('vi-VN'),
      //     check_out: tomorrow.toLocaleDateString('vi-VN'),
      //     guest_name: userInfo.userInfo.name,
      //     guest_phone: userInfo.userInfo.phoneNumber || ''
      //   }
      // });
  
      // Hiển thị thông báo thành công
      snackbar.openSnackbar({
        type: 'success',
        text: 'Đặt phòng thành công!'
      });
  
      // Chuyển hướng đến trang xác nhận
      // navigate('/booking/confirmation', {
      //   state: {
      //     bookingId: response.id,
      //     bookingDetails: {
      //       room_name: room.name,
      //       check_in: today.toLocaleDateString('vi-VN'),
      //       check_out: tomorrow.toLocaleDateString('vi-VN'),
      //       total_price: room.price,
      //       booking_status: 'PENDING'
      //     }
      //   }
      // });
  
    } catch (error: any) {
      console.error('Booking error:', error);
      snackbar.openSnackbar({
        type: 'error',
        text: error.message || 'Có lỗi xảy ra khi đặt phòng'
      });
    }
  };

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

  const handleWebView = async (link: string) => {
    // Xử lý xem phòng VR360
    try {
      await openWebview({
        url: link,
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
    <Box className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden ">
      <Box flex flexDirection="row" flexWrap className='relative'>
        <ImageCarousel
          images={room.images || []}
          autoplay={true}
          autoplayInterval={5000}
          showDots={true}
          showArrows={true}
          showNumbers={false}
        />
         <div className="absolute bottom-10 right-4 flex gap-2">
            <Button variant="secondary" size="small"
              onClick={() => {
                handleWebView(room.VideoURL)
              }}
            >
              {buttonName?.booking.video}
            </Button>
            <Button onClick={() => {
              // openWebview({url: "https://web-lanrungresort.vt360.vn/"})
              console.log(room.VRURL)
              handleWebView(room.VRURL? room.VRURL : '');
              // window.open("https://web-lanrungresort.vt360.vn/", '_blank');
            }} variant="secondary" size="small">
              {buttonName?.booking.VR360}
            </Button>
          </div>
      </Box>
      <Box mt={10} mx={2}>
        <Box mt={2}>
          <Box>
            <h2>{room.name}</h2>
            <h2 style={{ color: '#46A952' }}>{room.price.toLocaleString()}</h2>
          </Box>
          <Box>
            <h3
              style={{
                color: '#46A952',
                backgroundColor: '#EDF8F2',
                textAlign: 'center',
              }}
            >
              {room.characters.join(' | ')}
            </h3>
          </Box>
          <Box>
            <span
              style={{
                color: '#298267',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              {room.name}
            </span>
            - {room.introduction}
          </Box>
          <Box mt={2}>
            <Center gutters="1rem">
              <Grid columnCount={2}>
                {room.utilities?.map((amenity: any, index: any) => (
                  <Cluster key={index}>
                    <span>{getAmenityIcon(amenity.type)}</span>
                    <span style={{ margin: '2px' }}>{amenity.name}</span>
                  </Cluster>
                ))}
              </Grid>
            </Center>
          </Box>
        </Box>
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Button
          style={{
            marginTop: '5px',
            marginBottom: '10px',
            height: '100%',
            width: '80%',
            color: '#46A952',
          }}
          variant="secondary"
          size="large"
          // onClick={handleViewVR}
          onClick={() => {
            // openWebview({url: "https://web-lanrungresort.vt360.vn/"})
            handleWebView("https://web-lanrungresort.vt360.vn/");
            // Linking.openURL("https://web-lanrungresort.vt360.vn/");
          }}
        >
          Xem phòng (VR360)
        </Button>
      </Box>
      <Box mb={2} style={{ textAlign: 'center' }}>
        <Button 
          style={{ 
            height: "100%", 
            width: "80%", 
            color: "white", 
            backgroundColor: "#46A952" 
          }} 
          variant="secondary" 
          size="large"
          onClick={async () => {
            const userInfo = await getUserInfo()
            // // Tạo booking
            const response = await createBooking(userInfo, room)
            console.log('Booking response:', response)
          }}
          // onClick={handleViewVR}
        >
          Đặt phòng
        </Button>       
      </Box>
      <SharePopup
        name={room.name || ''}
        description={room.introduction || ''}
        thumbnail={room.images?.[0] ? room.images[0].src : ''}
      />
    </Box>
  )
};

export function getAmenityIcon(type: string) {
  const amenityMap: { [key: string]: AmenityIcon } = {
    "booking": AmenityIcon.Booking,
    "free beverage": AmenityIcon.CafeTea,
    "cook pot": AmenityIcon.CookPot,
    "direction": AmenityIcon.Direction,
    "dryer": AmenityIcon.Dryer,
    "home page": AmenityIcon.HomePage,
    "tv": AmenityIcon.LcdTv,
    "location": AmenityIcon.Location,
    "minibar": AmenityIcon.Minibar,
    "minigame": AmenityIcon.Minigame,
    "minus": AmenityIcon.Minus,
    "note": AmenityIcon.Note,
    "oa verified": AmenityIcon.OaVerified,
    "percentage": AmenityIcon.Percentage,
    "phone call": AmenityIcon.PhoneCall,
    "post notif": AmenityIcon.PostNotif,
    "restaurant": AmenityIcon.Restaurant,
    "room service": AmenityIcon.RoomService,
    "security": AmenityIcon.Security,
    "service": AmenityIcon.Service,
    "shopping cart": AmenityIcon.ShoppingCart,
    "simple zalo": AmenityIcon.SimpleZalo,
    "star": AmenityIcon.Star,
    "vault": AmenityIcon.Vault,
    "what apps": AmenityIcon.WhatApps,
    "wifi": AmenityIcon.Wifi,
  };

  const iconName = amenityMap[type];

  if (!iconName) return null;

  return <Icon name={iconName} />;
}