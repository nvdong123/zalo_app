import React from 'react'
import { Box, Text, Button, useSnackbar, useNavigate } from 'zmp-ui'

import { IconStar } from '@/components/icons'
import { Service } from '@/types/service'
import { getUserInfo, showFunctionButtonWidget } from 'zmp-sdk/apis';
import { notificationApi } from '@/services/api';
import { useButtonName } from '@/utils/use-button'


export const ServiceCard: React.FC<Service> = ({ id, name, description, discount, rating, thumbnail }) => {
    const snackbar = useSnackbar();  
    const navigate = useNavigate();
    const { data: buttonName } = useButtonName()
    
    function handleClick() {                
        navigate(`/service/${id}`, { animate: true, replace: false })
      }

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
    <Box className="flex bg-white rounded-lg p-4 mb-4 shadow-sm" onClick={handleClick}>
      <img src={thumbnail} alt={name} className="w-24 h-24 rounded-lg object-cover" />
      <Box className="flex-1 ml-4">
        <Box className="flex justify-between items-start">
          <Box>
            <Text.Title size="small" className="font-semibold">
              {name}
            </Text.Title>
            <Text size="small" className="text-gray-600">
              {description}
            </Text>
            <Text className="text-green-600 mt-1">Giảm giá {discount}</Text>
          </Box>
        </Box>
        <Box className="flex justify-between items-center mt-2">
          <div className="flex">
            {[...Array(rating)].map((_, index) => (
              <IconStar key={index} className="w-4 h-4 text-green-600" />
            ))}
          </div>
          <Button 
                onClick={async() => {          
                    const userInfo = await getUserInfo()
                    // // Tạo booking
                    const response = await createBooking(userInfo, name)
                    console.log('Booking response:', response)
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg" size="small"
            >
            { buttonName?.service.bookingnow }
          </Button>     
        </Box>
      </Box> 
    </Box>
  )
}
