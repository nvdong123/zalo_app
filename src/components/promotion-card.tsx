import React from 'react';
import { Box, Button, Text, useSnackbar } from 'zmp-ui';
import { Promotion } from '@/types/promotion';
import { notificationApi } from '@/services/api';
import { useOA } from '@/modules/oa/use-oa';

import { followOA, openChat, authorize, getUserInfo, getSetting, openWebview } from 'zmp-sdk/apis'
import { useButtonName } from '@/utils/use-button';
import SharePopup from './share-popup';

interface PromotionCardProps {
  onClick?: () => void,
  promotion: Promotion
}

const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(num => parseInt(num));
  return new Date(year, month - 1, day, 23, 59, 59); // Set thời gian là cuối ngày (23:59:59)
};

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const snackbar = useSnackbar();  
  const [timeRemaining, setTimeRemaining] = React.useState<string>('');
  const { data: merchantOA, refetch } = useOA();
  const { data: buttonName } = useButtonName()
  // console.log(merchantOA)
  const endDate = parseDate(promotion.end_date).getTime();

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const timeLeft = endDate - now;

    if (timeLeft <= 0) {
      return 'Đã kết thúc';
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (days > 0) {
      return `CÒN LẠI ${days} NGÀY ${hours} GIỜ ${minutes} PHÚT ${seconds} GIÂY`;
    } else if (hours > 0) {
      return `CÒN LẠI ${hours} GIỜ ${minutes} PHÚT ${seconds} GIÂY`;
    } else if (minutes > 0) {
      return `CÒN LẠI ${minutes} PHÚT ${seconds} GIÂY`;
    } else {
      return `CÒN LẠI ${seconds} GIÂY`;
    }
  };

  const handleFollow = async () => {
    // console.log(merchantOA?.oa.id)
    if (!merchantOA) return
    // try {
      await followOA({
        id: merchantOA.oa.id,
        success: () => {
          refetch()  
          // console.log(merchantOA)
        },
        fail: (err) => {
          console.log(err)
        },
      })
      // console.log('Followed OA')
      // await refetch()
      // console.log(merchantOA)
      // snackbar.openSnackbar({
      //   type: 'success',
      //   text: 'Đã quan tâm OA thành công',
      // })
    // }
    // catch (error) {
    //   console.error('Error following OA:', error)
    //   snackbar.openSnackbar({
    //     type: 'error',
    //     text: 'Có lỗi xảy ra khi quan tâm OA',
    //   })
    // }
  };

  const createBooking = async (userInfo: any, name: any) => {
    // try {
      // Hiển thị loading
      await snackbar.openSnackbar({
        type: 'info',
        text: 'Đang xử lý ...!',
      })

      // Check nếu promotion đã hết hạn
      if (calculateTimeRemaining() === 'Đã kết thúc') {
        throw new Error('Ưu đãi đã hết hạn');
      }

      // Lấy ngày hiện tại cho check_in và check_out
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      // console.log(userInfo)
      await notificationApi.sendPromotionNotification({
        merchantOA,
        userId: userInfo.userInfo.id,
        customerName: userInfo.userInfo.name,
        bookingNumber: 'BK123456',
        bookingNote: 'Đặt phòng Deluxe - 2 người lớn',
        promotionName: name,
      })
      console.log('Booking success!')
      // Hiển thị thông báo thành công
      snackbar.openSnackbar({
        type: 'success',
        text: 'Đặt dịch vụ thành công!',
      })
    // } catch (error: any) {
    //   console.error('Booking error:', error)
    //   snackbar.openSnackbar({
    //     type: 'error',
    //     text: error.message || 'Có lỗi xảy ra khi đặt dịch vụ',
    //   })
    // }
  }

  // Update time remaining mỗi phút
  React.useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining());
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endDate]); // Thêm endDate vào dependencies

  return (
    <Box className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
      id={promotion.id}
    >
      <Box className="relative">
        <img 
          src={promotion.imageUrl} 
          alt={promotion.title}
          className="w-full h-48 object-cover"
        />
        {timeRemaining && timeRemaining !== 'Đã kết thúc' && (
          <Box className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            {timeRemaining}
          </Box>
        )}
      </Box>

      <Box className="p-4">
        <Text.Title size="small" className="font-bold mb-2">
          {promotion.title}
        </Text.Title>
        
        <Text size="small" className="text-gray-600 mb-4">
          {promotion.description}
        </Text>

        <Box className="space-y-1 mb-4">
          <Text className="text-sm">
            <strong>Ngày bắt đầu:</strong> {promotion.start_date}
          </Text>
          <Text className="text-sm">
            <strong>Ngày kết thúc:</strong> {promotion.end_date}
          </Text>
        </Box>

        <Button 
          className="w-full py-3 disabled:bg-gray-400 text-[#2F8A3A] bg-[#EDF8F2] border-[1px] border-solid hover:bg-[#D1F0D1] mb-4"
          disabled={merchantOA?.followed === true}
          onClick={handleFollow}
        >
          {merchantOA?.followed === true ? 'Đã quan tâm OA' : buttonName?.promotion.followOA}
        </Button>

        <Button 
          className="w-full bg-green-600 text-white py-3 disabled:bg-gray-400"
          disabled={timeRemaining === 'Đã kết thúc' || merchantOA?.followed === false}
          onClick={async() => {
            const userInfo = await getUserInfo();
            await createBooking(userInfo, promotion.title);
          }}
        >
          {timeRemaining === 'Đã kết thúc' ? 'Đã hết hạn' : merchantOA?.followed === true ? buttonName?.promotion.getPromotion : buttonName?.promotion.followOA + ' để nhận ưu đãi'}
        </Button>
      </Box>
      <SharePopup
        thumbnail={promotion.imageUrl}
        name={promotion.title}
        description={promotion.description}
      />
    </Box>
  );
}

export const PromotionSuggestCard: React.FC<PromotionCardProps> = ({ promotion, onClick }) => {
  const [timeRemaining, setTimeRemaining] = React.useState<string>('');
  const { data: merchantOA } = useOA();

  const endDate = parseDate(promotion.end_date).getTime();

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const timeLeft = endDate - now;

    if (timeLeft <= 0) {
      return 'Đã kết thúc';
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (days > 0) {
      return `CÒN LẠI ${days} NGÀY ${hours} GIỜ ${minutes} PHÚT ${seconds} GIÂY`;
    } else if (hours > 0) {
      return `CÒN LẠI ${hours} GIỜ ${minutes} PHÚT ${seconds} GIÂY`;
    } else if (minutes > 0) {
      return `CÒN LẠI ${minutes} PHÚT ${seconds} GIÂY`;
    } else {
      return `CÒN LẠI ${seconds} GIÂY`;
    }
  };


  React.useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining());
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endDate]); // Thêm endDate vào dependencies


  return (
    <div className="relative min-w-[280px] rounded-lg overflow-hidden shadow" 
      onClick={onClick}
    >
      <img
        src={promotion.imageUrl}
        className="w-full h-[160px] object-cover"
      />

      {timeRemaining && timeRemaining !== 'Đã kết thúc' && (
        <Box className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
          {timeRemaining}
        </Box>
      )}
      <div className="p-3">
        <Text className="font-medium">{promotion.title}</Text>
      </div>
    </div>
  )
}