// src/modules/oa/use-oa.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { followOA, openChat,authorize, getPhoneNumber, getUserInfo, getUserID } from 'zmp-sdk/apis'
import { request } from '@/utils/request'

// Types
interface OAInfo {
  id: string
  name: string
  avatarUrl: string
  coverUrl: string
  description?: string
  phone: string
  address?: string
  status: 'active' | 'inactive'
}

interface OAResponse {
  oa: OAInfo
  followed: boolean
  isSubscribed?: boolean
  tags?: string[]
}

interface SendMessageParams {
  type: 'text' | 'template' | 'list' | 'media'
  content: any
  attachments?: Array<{
    type: string
    payload: any
  }>
}

// Types
interface AuthorizeScope {
  'scope.userInfo': boolean
  'scope.userLocation': boolean  
  'scope.userPhonenumber': boolean

}

interface AuthorizeResponse {
  scope: AuthorizeScope
}

type ScopeType = keyof AuthorizeScope

// Hook để authorize các scopes
export function useAuthorizeScope() {
  return useMutation({
    mutationFn: async (scopes: ScopeType[]) => {
      try {
        const response = await authorize({
          scopes,
          success: async () => {
            console.log('Authorize success !')             
            const { userInfo } = await getUserInfo({});
            // console.log(userInfo)
           
          },
          fail: (error) => {
            console.error('Authorize failed:', error)
            throw error
          }
        })
        return response
      } catch (error) {
        console.error('Error authorizing scopes:', error)
        throw error
      }
    }
  })
}

// Hook để xin quyền user info
export function useAuthorizeUserInfo() {
  const authorizeScope = useAuthorizeScope()

  const requestUserInfo = async () => {
    try {
      // Xin quyền userInfo
      await authorizeScope.mutateAsync(['scope.userInfo'])
      
      // Sau khi được cấp quyền, lấy thông tin user
      const userInfo = await getUserInfo({})
      return userInfo
    } catch (error) {
      console.error('Error getting user info:', error)
      throw error
    }
  }

  return useMutation({
    mutationFn: requestUserInfo
  })
}

// Hook để xin quyền phone number
export function useAuthorizePhoneNumber() {
  const authorizeScope = useAuthorizeScope()

  const requestPhoneNumber = async () => {
    try {
      // Xin quyền phone number
      await authorizeScope.mutateAsync(['scope.userPhonenumber'])
      
      // Sau khi được cấp quyền, lấy số điện thoại
      const phoneNumber = await getPhoneNumber({})
      return phoneNumber
    } catch (error) {
      console.error('Error getting phone number:', error) 
      throw error
    }
  }

  return useMutation({
    mutationFn: requestPhoneNumber
  })
}

// Hook để lấy thông tin OA
export function useOA() {
  // console.log('call')
  return useQuery({
    queryKey: ['oa'],
    queryFn: async () => {
      try {
        // Gọi API của backend để lấy thông tin OA
        const backendOAData = await request<OAResponse>('/oa')

        // Lấy thêm thông tin từ Zalo SDK
        const zaloOAInfo = await getUserInfo()
        // console.log(zaloOAInfo)

        // Merge thông tin từ cả 2 nguồn
        return {
          oa: {
            ...backendOAData.oa,
            ...zaloOAInfo,
          },
          // followed: zaloOAInfo.userInfo.followedOA || backendOAData.followed,
          // followed: backendOAData.followed,
          followed: zaloOAInfo.userInfo.followedOA,
        }
      } catch (error) {
        console.error('Error fetching OA info:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // Cache trong 5 phút
    retry: 2,
  })
}

// Hook xử lý follow/unfollow OA
export function useFollowOA() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params: { 
      oaId: string, 
      welcomeMessage?: SendMessageParams 
    }) => {
      const { oaId, welcomeMessage } = params
      
      try {
        // Follow OA
        await followOA({ id: oaId })

        // Nếu có welcome message, gửi tin nhắn
        if (welcomeMessage) {
          await openChat({
            type: 'oa',
            id: oaId,
            message: welcomeMessage.content,
            // attachments: welcomeMessage.attachments,
            success: () => {
              console.log('Sent welcome message successfully')
            },
            fail: (error) => {
              console.error('Failed to send welcome message:', error)
            }
          })
        }

        return true
      } catch (error) {
        console.error('Error following OA:', error)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate và refetch OA data
      queryClient.invalidateQueries({
        queryKey: ['oa'],
      })
    },
    onError: (error) => {
      console.error('Follow OA mutation error:', error)
    }
  })
}

// Hook để mở chat và gửi tin nhắn
// export function useOpenChat() {
//   return useMutation({
//     mutationFn: async (params: {
//       id: string
//       type: 'oa' | 'user'
//       message?: string | SendMessageParams
//     }) => {
//       const { id, type, message } = params

//       try {
//         await openChat({
//           type,
//           id,
//           message: typeof message === 'string' ? message : message?.content,
//           attachments: typeof message === 'object' ? message.attachments : undefined,
//           success: () => {
//             console.log('Opened chat successfully')
//           },
//           fail: (error) => {
//             console.error('Failed to open chat:', error)
//             throw error
//           }
//         })
//       } catch (error) {
//         console.error('Error opening chat:', error)
//         throw error
//       }
//     }
//   })
// }

// Hook để gửi tin nhắn template
// export function useSendTemplateMessage() {
//   return useMutation({
//     mutationFn: async (params: {
//       oaId: string
//       template: {
//         type: string
//         buttons: Array<{
//           type: string
//           title: string
//           payload?: any
//           url?: string
//         }>
//         text: string
//         elements?: any[]
//       }
//     }) => {
//       const { oaId, template } = params

//       try {
//         await openChat({
//           type: 'oa',
//           id: oaId,
//           message: {
//             type: 'template',
//             ...template
//           },
//           success: () => {
//             console.log('Sent template message successfully')
//           },
//           fail: (error) => {
//             console.error('Failed to send template message:', error)
//           }
//         })
//       } catch (error) {
//         console.error('Error sending template message:', error)
//         throw error
//       }
//     }
//   })
// }