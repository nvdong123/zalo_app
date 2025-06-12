// src/pages/service_details.tsx
import React from 'react'
import { useState, useEffect } from 'react'
import { Box, Header, Text, Button, Icon, useSnackbar } from 'zmp-ui'
import { IconShare, IconHeart } from '@/components/icons'
import { ServiceDetails } from '@/types/service'
import { notificationApi } from '@/services/api';
import { getUserInfo, openPhone } from 'zmp-sdk/apis'
import { useOA } from '@/modules/oa/use-oa'
import { ImageCarousel } from './image-carousel'
import { openShareSheet } from "zmp-sdk/apis";
import SharePopup from './share-popup';
import { useOaState } from '@/modules/oa/oa.state'


export const ServiceDetailsPage: React.FC<ServiceDetails>  = ({ name, description, images, benefits }) => {
  const [currentImage, setCurrentImage] = React.useState(0)
  const snackbar = useSnackbar();  
  const { data: merchantOA } = useOA()
  // console.log(merchantOA)
  if (!images || images.length === 0) {
    images = []
  }
  const id = window.location.pathname.split('/').pop();
  const oaActions = useOaState((state) => state.actions)
  const showCount = useOaState((state) => state.showCount)
 

  useEffect(() => {
    if (!merchantOA) return
    if (merchantOA.followed) return
    if (showCount > 0) return
    // console.log('hjhj')
    oaActions.openRequestFollowDialog()
  }, [merchantOA, oaActions, showCount])  


  const shareCurrentPage = async () => {
    try {
      const data = await openShareSheet({
        type: "zmp",
        data: {
          title: "My Zalo Mini App - HomePage",
          description: "Home page",
          thumbnail: "https://sample-videos.com/img/Sample-jpg-image-50kb.jpg",
        },
      });
    } catch (err) {}
  };
  
  const createBooking = async (userInfo: any, name: any) => {
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
           
            await notificationApi.sendServiceNotification({
              merchantOA,
              userId: userInfo.userInfo.id,
              customerName: userInfo.userInfo.name,
              bookingNumber: "BK123456",
              bookingNote: "Đặt phòng Deluxe - 2 người lớn",
              serviceName: name
            });
        
         
            // Hiển thị thông báo thành công
            snackbar.openSnackbar({
              type: 'success',
              text: 'Đặt dịch vụ thành công!'
            });                
        
          } catch (error: any) {
            console.error('Booking error:', error);
            snackbar.openSnackbar({
              type: 'error',
              text: error.message || 'Có lỗi xảy ra khi đặt dịch vụ'
            });
          }
        };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-50 mt-[62px]">
      
      {/* Image Carousel */}
      <Box className="relative h-[300px]">
        <ImageCarousel
          images={images?.map((url) => ({ 
            src: url,
            alt: 'Service Image',
            title: 'Service Image' 
          })) || []}
          autoplay={false}
          autoplayInterval={5000}
          showDots={false}
          showArrows={false}
          showNumbers={true}
        />
      </Box>

      {/* Content */}
      <Box className="px-4 py-4">
        {/* Title Section */}
        <Box className="flex justify-between items-start mb-4">
          <Text.Title size="large">{name}</Text.Title>
          <IconHeart 
            size={24} 
            className="text-gray-500"
          />
        </Box>

        {/* Contact Button */}
        <Button 
          variant="tertiary" 
          className="text-green-600 mb-4"
          onClick={async () => {
            try {
              await openPhone({
                phoneNumber: merchantOA?.oa.phone || '',
              });
            } catch (error) {
              // xử lý khi gọi api thất bại
              console.log(error);
            }
          }}
        >
          Liên hệ
        </Button>

        {/* Share Section */}
        <SharePopup
          name={name ? name : ''}
          description={description ? description : ''}
          thumbnail={images?.[0]}
        />

        {/* Details Section */}
        <Box className="mb-6">
          <Text.Title className="mb-3">Chi tiết sản phẩm</Text.Title>
          <Text className="text-gray-600">
            {description}
          </Text>
        </Box>

        {/* Benefits Section */}
        <Box className="bg-green-50 p-4 rounded-lg mb-6">
          <Text.Title className="mb-3">Bạn sẽ nhận được:</Text.Title>
          <Box className="space-y-3">
            {benefits?.map((benefit, index) => (
              <Box key={index} className="flex gap-2">
                <Text className="text-green-600">★</Text>
                <Text className="flex-1">{benefit}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bottom Button */}
      <Box className="mt-auto p-4">
        <Button 
          className="w-full bg-green-600"
          onClick={async() => {          
            const userInfo = await getUserInfo()
            // // Tạo booking
            const response = await createBooking(userInfo, name)
            console.log('Booking response:', response)
        }}
        >
          Đặt Dịch vụ
        </Button>
      </Box>
      
      
    </Box>
  )
}

export default ServiceDetailsPage