const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

import axios from 'axios'
import { openChat } from 'zmp-sdk/apis'
// Types based on BE schemas
export interface BookingCreate {
  hotel_id: string
  room_id: string
  user_id: string
  zalo_id: string
  check_in: string
  check_out: string
  rooms: string[]
  special_requests?: string
  guest_name: string
  guest_email?: string
  guest_phone: string
  adult_count: number
  children_count: number
  note?: string
}

export interface BookingResponse {
  id: string
  booking_number: string
  check_in: string
  check_out: string
  status: string
  total_amount: number
  rooms: Array<{
    id: string
    room_id: string
    room_price: number
    extra_person_count: number
    room_type_name?: string
  }>
  guest_name: string
  guest_phone: string
  guest_email?: string
  special_requests?: string
}

interface Button {
  title: string;
  image_icon: string;
  url: string;
}

interface TemplateData {
  customer_name: string;
  queue_number: string;
  note?: string;
  buttons?: Button[];
}

interface MessagePayload {
  recipient: {
    user_id: string;
  };
  message: {
    // template_type: string;
    // template_data: TemplateData;
    text: string;
  };
}

// Config
const ZALO_API_URL = 'https://openapi.zalo.me/v3.0';
const DEFAULT_TEMPLATE_TYPE = 'FB0001';

// API Client
const zaloApiClient = axios.create({
  baseURL: ZALO_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include access token
zaloApiClient.interceptors.request.use(async (config) => {
  try {
    // const accessToken = await getAccessToken();
    // console.log('accessToken',accessToken);
    const response = await axios.get(`${API_URL}/api/v1/zalo/token`);  
    if (response.data.access_token) {
      config.headers['access_token'] = response.data.access_token;
    }    
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const notificationApi = {
  /**
   * Send notification via Zalo Mini App OA
   */
  sendNotification: async ({
    merchantOA,
    userId,
    customerName,
    roomName,
    queueNumber,
    note,
    buttons,
    templateType = DEFAULT_TEMPLATE_TYPE,
    messageToken,  }: {
    merchantOA: any;
    userId: string;
    customerName: string;
    roomName: string;
    queueNumber: string;
    note?: string;
    buttons?: Button[];
    templateType?: string;
    messageToken: unknown | undefined;
  }) => {
    try {
      // Prepare message payload
      // const payload: MessagePayload = {
      //   recipient: {
      //     user_id: userId
      //   },
      //   message: {
      //     template_type: templateType,
      //     template_data: {
      //       customer_name: customerName,
      //       queue_number: queueNumber,
      //       note: note,
      //       buttons: buttons || [
      //         {
      //           title: "Chi tiết đơn hàng",
      //           image_icon: "https://stc-zmp.zadn.vn/oa/basket.png",
      //           url: "https://zalo.me/s/194839900003483517/"
      //         },
      //         {
      //           title: "Đánh giá",
      //           image_icon: "https://stc-zmp.zadn.vn/oa/star.png",
      //           url: "https://zalo.me/s/194839900003483517/"
      //         }
      //       ]
      //     }
      //   }
      // };

      const payload: MessagePayload = {
        recipient: {
          user_id: userId
        },
        message: {
         text: `Cám ơn bạn đã đặt phòng.\nTên phòng: ${roomName} \nChúng tôi sẽ liên hệ với bạn để xác nhận thông tin !`
        }
      };

      console.log('messageToken', messageToken)

      // Add request interceptor to include access token
      zaloApiClient.interceptors.request.use(async (config) => {
        try {
          if (messageToken) {
            config.headers['miniapp_message_token'] = messageToken;
          }
          return config;
        } catch (error) {
          return Promise.reject(error);
        }
      });
      

      // Send notification
      // const response = await zaloApiClient.post('/oa/message/cs/miniapp', payload);
      const response = await zaloApiClient.post('/oa/message/cs', payload);
      await openChat({
        type: 'oa',
        id: merchantOA ? merchantOA.oa.id : '',
      })
      // console.log(response)
      return response.data;

    } catch (error: any) {
      console.error('Error sending notification:', error);
      throw new Error(error.response?.data?.message || 'Có lỗi khi gửi thông báo');
    }
  },

  sendRoomNotification: async ({
    merchantOA,
    userId,
    customerName,
    bookingNumber,
    roomName,
    bookingNote,
    queueNumber,
    note,
    buttons,
    templateType = DEFAULT_TEMPLATE_TYPE,
    }: {
    merchantOA: any;
    userId: string;
    customerName: string;
    bookingNumber: string;
    bookingNote: string;
    roomName: string;
    queueNumber?: string;
    note?: string;
    buttons?: Button[];
    templateType?: string;    
  }) => {
    try {      
      const payload: MessagePayload = {
        recipient: {
          user_id: userId
        },
        message: {
         text: `Cám ơn bạn đã đặt phòng.\nMã đặt phòng: ${bookingNumber} \nTên phòng: ${roomName} \nTên người đặt: ${customerName} \nGhi chú: ${bookingNote} \nChúng tôi sẽ liên hệ với bạn để xác nhận thông tin !`
        }
      };


      // Send notificationVR360
      // const response = await zaloApiClient.post('/oa/message/cs/miniapp', payload);
      const response = await zaloApiClient.post('/oa/message/cs', payload);
      // console.log(response)
      await openChat({
        type: 'oa',
        id: merchantOA ? merchantOA.oa.id : '',
      })
      return response.data;

    } catch (error: any) {
      console.error('Error sending notification:', error);
      throw new Error(error.response?.data?.message || 'Có lỗi khi gửi thông báo');
    }
  },

  sendServiceNotification: async ({
    merchantOA,
    userId,
    customerName,
    bookingNumber,
    bookingNote,
    serviceName,
    queueNumber,
    note,
    buttons,
    templateType = DEFAULT_TEMPLATE_TYPE,
    }: {
    merchantOA: any;
    userId: string;
    customerName: string;
    bookingNumber: string;
    bookingNote: string;
    serviceName: string;
    queueNumber?: string;
    note?: string;
    buttons?: Button[];
    templateType?: string;
  }) => {
    try {      
      const payload: MessagePayload = {
        recipient: {
          user_id: userId
        },
        message: {
         text: `Cám ơn bạn đã đặt dịch vụ.\nMã đặt dịch vụ: ${bookingNumber} \nTên dịch vụ: ${serviceName} \nTên người đặt: ${customerName} \nGhi chú: ${bookingNote} \nChúng tôi sẽ liên hệ với bạn để xác nhận thông tin !`
        }
      };

      // Send notification
      // const response = await zaloApiClient.post('/oa/message/cs/miniapp', payload);
      const response = await zaloApiClient.post('/oa/message/cs', payload);
      // console.log(response)
      await openChat({
        type: 'oa',
        id: merchantOA ? merchantOA.oa.id : '',
      })
      return response.data;

    } catch (error: any) {
      console.error('Error sending notification:', error);
      throw new Error(error.response?.data?.message || 'Có lỗi khi gửi thông báo');
    }
  },

  sendPromotionNotification: async ({
    merchantOA,
    userId,
    customerName,
    bookingNumber,
    bookingNote,
    promotionName,
    queueNumber,
    note,
    buttons,
    templateType = DEFAULT_TEMPLATE_TYPE,
    }: {
    merchantOA: any;
    userId: string;
    customerName: string;
    bookingNumber: string;
    bookingNote: string;
    promotionName: string;
    queueNumber?: string;    
    note?: string;
    buttons?: Button[];
    templateType?: string;  }) => {
    try {      
      const payload: MessagePayload = {
        recipient: {
          user_id: userId
        },
        message: {
         text: `Bạn đã nhận được ưu đãi.\nMã ưu đãi: ${bookingNumber} \nTên ưu đãi: ${promotionName} \nTên người nhận: ${customerName} \nGhi chú: ${bookingNote}\nChúng tôi sẽ liên hệ với bạn để xác nhận thông tin !`
        }
      };

      // Send notification
      // const response = await zaloApiClient.post('/oa/message/cs/miniapp', payload);
      const response = await zaloApiClient.post('/oa/message/cs', payload);
      // console.log(response)
      await openChat({
        type: 'oa',
        id: merchantOA ? merchantOA.oa.id : '',
      })
      return response.data;

    } catch (error: any) {
      console.error('Error sending notification:', error);
      throw new Error(error.response?.data?.message || 'Có lỗi khi gửi thông báo');
    }
  },


  sendLuckyWheelNotification: async ({
    merchantOA,
    userId,
    customerName,
    promotionName,
    queueNumber,
    note,
    buttons,
    templateType = DEFAULT_TEMPLATE_TYPE,
    }: {
    merchantOA: any;
    userId: string;
    customerName: string;
    promotionName: string;
    queueNumber?: string;    
    note?: string;
    buttons?: Button[];
    templateType?: string;  }) => {
    try {      
      const payload: MessagePayload = {
        recipient: {
          user_id: userId
        },
        message: {
         text: `Chúc mừng bạn đã nhận được ưu đãi. \nVoucher: ${promotionName} `
        }
      };

      // Send notification
      // const response = await zaloApiClient.post('/oa/message/cs/miniapp', payload);
      const response = await zaloApiClient.post('/oa/message/cs', payload);
      // console.log(response)
      await openChat({
        type: 'oa',
        id: merchantOA ? merchantOA.oa.id : '',
      })
      return response.data;

    } catch (error: any) {
      console.error('Error sending notification:', error);
      throw new Error(error.response?.data?.message || 'Có lỗi khi gửi thông báo');
    }
  },

  // Example usage
  // sendBookingNotification: async ({
  //   userId,
  //   customerName,
  //   bookingNumber,
  //   roomName,
  //   bookingNote,
  //   messageToken
  // }: {
  //   userId: string;
  //   customerName: string;
  //   bookingNumber: string;
  //   roomName: string;
  //   bookingNote?: string;
  //   messageToken: unknown | undefined;
  // }) => {
  //   const buttons = [
  //     {
  //       title: "Xem chi tiết đặt phòng",
  //       image_icon: "https://stc-zmp.zadn.vn/oa/basket.png",
  //       url: `https://zalo.me/s/booking/${bookingNumber}`
  //     },
  //     {
  //       title: "Đánh giá dịch vụ",
  //       image_icon: "https://stc-zmp.zadn.vn/oa/star.png",
  //       url: "https://zalo.me/s/review"
  //     }
  //   ];

  //   return notificationApi.sendNotification({
  //     userId,
  //     customerName,
  //     queueNumber: bookingNumber,
  //     note: bookingNote,
  //     roomName,
  //     buttons,
  //     messageToken
  //   });
  // }
};

// Error handling helper
export const handleNotificationError = (error: any): string => {
  if (error.response) {
    const errorData = error.response.data;
    if (errorData.message) {
      return errorData.message;
    }
    return 'Lỗi từ Zalo API';
  }
  if (error.request) {
    return 'Lỗi kết nối đến Zalo API';
  }
  return error.message || 'Có lỗi xảy ra khi gửi thông báo';
};

// API client setup
const apiClient = axios.create({
  baseURL: API_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})
// Request interceptor to add access token
// apiClient.interceptors.request.use(async (config) => {
//   try {
//     const accessToken = await getAccessToken()
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`
//     }
//     return config
//   } catch (error) {
//     return Promise.reject(error)
//   }
// })

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.detail || error.message
    return Promise.reject(new Error(errorMessage))
  },
)

export const bookingApi = {
  // Get all hotels
  getHotels: async () => {
    const response = await apiClient.get('/api/v1/hotels')
    return response.data
  },

  // Create new booking
  createBooking: async (bookingData: BookingCreate) => {
    console.log(bookingData)
    const response = await apiClient.post('/api/v1/bookings/create', bookingData)
    return response.data
  },

  // Get booking by ID
  getBookingById: async (bookingId: string): Promise<BookingResponse> => {
    const response = await apiClient.get(`/api/v1/bookings/${bookingId}`)
    return response.data
  },

  // Get user's bookings
  getUserBookings: async (): Promise<BookingResponse[]> => {
    const response = await apiClient.get('/api/v1/bookings')
    return response.data
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<BookingResponse> => {
    const response = await apiClient.put(`/api/v1/bookings/${bookingId}/cancel`)
    return response.data
  },

  // Update booking
  updateBooking: async (bookingId: string, updateData: Partial<BookingCreate>): Promise<BookingResponse> => {
    const response = await apiClient.put(`/api/v1/bookings/${bookingId}`, updateData)
    return response.data
  },
}

// Error handling helper
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server error response
    const errorData = error.response.data
    if (errorData.detail) {
      return errorData.detail
    }
    return 'Server error occurred'
  }
  if (error.request) {
    // Network error
    return 'Network error occurred'
  }
  // Other errors
  return error.message || 'An unexpected error occurred'
}
