import React, { useEffect, Suspense } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import { Button, Header, Icon, Text, useSnackbar, useNavigate } from 'zmp-ui'
import { ChipListRef } from '@/components/chip-list'
import { PromotionSuggestCard } from '@/components/promotion-card'
import { IconPercentage, IconBooking, IconService, IconMinigame } from '@/components/icons'
import { MerchantNotFoundError } from '@/constants/errors'
import { useOaState } from '@/modules/oa/oa.state'
import { useFollowOA, useOA, useAuthorizePhoneNumber, useAuthorizeUserInfo } from '@/modules/oa/use-oa'
import { clsx } from '@/utils/clsx'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { followOA, openChat, authorize, getUserInfo, getSetting, openWebview } from 'zmp-sdk/apis'

import { useMerchant } from '../use-merchant'
import { MerchantAvatar } from './merchant-avatar'
import { MerchantCover } from './merchant-cover'
import { MerchantPageLoading } from './merchant-page-loading'
import { Routes } from '@/constants/routes'
import { usePromotionSuggest } from '@/modules/promotions/use-promotions'
import { c } from 'vite/dist/node/types.d-aGj9QkWt'
import { MyTabs } from '@/components/my-tabs'

import logo from '/images/logo-the-cliff.png'
import cover from '/images/cover-the-cliff.jpg'
import { MyHeader } from '@/components/my-header'
import MerchantHeader from '@/components/merchant-header'
import { useButtonName } from '@/utils/use-button'
import SharePopup from '@/components/share-popup'

const ChipList = React.lazy(() => import('@/components/chip-list'))

const threshold: number[] = []
for (let i = 0; i <= 1.0; i += 0.01) {
  threshold.push(i)
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


export function MerchantPage() {
  const snackbar = useSnackbar()
  const { data: buttonName } = useButtonName()
  const { data: merchant, isLoading: merchantLoading } = useMerchant()
  const { data: merchantOA, refetch } = useOA()
  const { data: promotionSuggest } = usePromotionSuggest()
  const oaActions = useOaState((state) => state.actions)
  const showCount = useOaState((state) => state.showCount)

  const { entry, ref } = useIntersectionObserver({ threshold })
  // console.log(buttonName)
  // const { requestFollowDialog, actions } = useOaState()

  const isLoading = merchantLoading
  const navigate = useNavigate()

  // const followOA = useFollowOA()

  const menuOptions = [
    {
      id: 'promotion',
      label: buttonName?.merchant.promotion,
      icon: <IconPercentage />,
    },
    {
      id: 'booking',
      label: 'Đặt phòng',
      icon: <IconBooking />,
    },
    {
      id: 'luckywheel',
      label: 'Quà may mắn',
      icon: <IconMinigame />,
    },
    {
      id: 'service',
      label: 'Dịch vụ',
      icon: <IconService />,
    },
  ]

  // useEffect(() => {
  //   useAuthorizePhoneNumber();
  //   useAuthorizeUserInfo();
  // },[])

  useEffect(() => {
    if (!merchantOA) return
    if (merchantOA.followed) return
    if (showCount > 0) return
    console.log('hjhj')
    oaActions.openRequestFollowDialog()
  }, [merchantOA, oaActions, showCount])  

  useEffect(() => {
    getSetting({
      success: (data) => {
        // console.log(data)
        if(!data.authSetting['scope.userInfo']){
          authorize({
            scopes: ['scope.userInfo'],
            success: async () => {
              // xử lý khi gọi api thành công
              // console.log('Authorized UserInfo Successfully !')
              const { userInfo } = await getUserInfo({});
              // console.log(userInfo)
            },
            fail: (error) => {
              // xử lý khi gọi api thất bại
              console.log(error)
            },
          })
        }

        if(!data.authSetting['scope.userPhonenumber']){
          authorize({
            scopes: ['scope.userPhonenumber'],
            success: async () => {
              // xử lý khi gọi api thành công
              // console.log('Authorized Phone Number Successfully !')
              const { userInfo } = await getUserInfo({});
              // console.log(userInfo)
            },
            fail: (error) => {
              // xử lý khi gọi api thất bại
              console.log(error)
            },
          })
        }
        // xử lý khi gọi api thành công. Vd:
        // data.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  }, [])

  function handleTabChange(option: any) {
    const tab = option.value
    let url = Routes.merchant.page()
    switch (tab) {
      case 'info':
        url = Routes.merchant.info()
        break
      case 'booking':
        url = Routes.merchant.booking()
        break
      case 'homepage':
        url = Routes.merchant.info()
        break
      case 'service':
        url = Routes.merchant.service()
        break
      case 'luckywheel':
        url = Routes.merchant.luckywheel()
        break
      default:
        url = Routes.merchant.info()
        break
    }
    navigate(url, { animate: false, replace: true })
  }

  const authorizeUser = async () => {
    try {
      const data = await authorize({
        scopes: ["scope.userLocation", "scope.userPhonenumber"],
      });
      // console.log(data);
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  async function handleFollow() {
    // console.log(merchantOA?.oa.id)
    if (!merchantOA) return
    try {
      await followOA({
        id: merchantOA.oa.id,
        success: () => {
          // console.log('Followed OA')
        },
        fail: (err) => {
          console.log(err)
        },
      })

      await refetch()

      // // Định nghĩa welcome messages với type
      // interface WelcomeMessage {
      //   text: string
      //   attachment?: {
      //     type: string
      //     payload: {
      //       template_type: string
      //       buttons: Array<{
      //         type: string
      //         title: string
      //         url: string
      //       }>
      //     }
      //   }
      // }

      // Định nghĩa mapping messages với type
      // const welcomeMessages: Record<string, WelcomeMessage> = {
      //   'The-Cliff': {
      //     text: 'Chào mừng bạn đến với The Cliff Resort! 🌊\n\nCảm ơn bạn đã quan tâm đến The Cliff Resort. Chúng tôi sẽ gửi đến bạn những ưu đãi đặc biệt và thông tin mới nhất.',
      //     attachment: {
      //       type: 'template',
      //       payload: {
      //         template_type: 'button',
      //         buttons: [
      //           {
      //             type: 'oa.open.url',
      //             title: 'Đặt Phòng Ngay',
      //             url: 'https://thecliffresort.com.vn/booking',
      //           },
      //         ],
      //       },
      //     },
      //   },
      // }

      // Show success notification
      snackbar.openSnackbar({
        type: 'success',
        text: 'Đã quan tâm OA thành công',
      })

      // Gửi welcome message dựa trên merchant
      try {
        // const merchantMessage = welcomeMessages[merchant.merchantId]
        // if (merchantMessage) {
        //   await openChat({
        //     type: 'oa',
        //     id: merchantOA.oa.id,
        //     message: merchantMessage.text
        //   })
        // }
        await openChat({
          type: 'oa',
          id: merchantOA.oa.id,
        })
      } catch (error) {
        console.error('Error sending welcome message:', error)
      }
    } catch (error) {
      console.log(error)
    } finally {
      oaActions.closeRequestFollowDialog()
    }
  }
  
  

  
  if (isLoading) return <MerchantPageLoading />
  if (!merchant) throw new MerchantNotFoundError()
  

  return (
    <div className="relative flex flex-col min-h-screen relative">
      {/* <MyHeader title={merchant?.name} showBackIcon={true} className="no-divider" /> */}
      {/* <MerchantHeader title={merchant?.name} logoUrl={merchant?.logoUrl} /> */}
      {/* Header với carousel hình ảnh */}
      
      <div className="absolute inset-0 h-[250px]" style={{ backgroundColor: '#65BF68', color: '#FFFFFF', borderRadius: '0px 0px 75px 75px / 0px 0px 15px 15px' }}></div>
      <div className='absolute top-11 left-0 p-1 w-[50px] h-[50px] bg-white rounded-full ml-4'>
        <img src={merchant?.logoUrl} className='object-cover w-full h-full'/>
      </div>

      <div className="relative h-[250px] mt-[90px]">
      
        <div className="absolute inset-4" >
          <img src={merchant?.coverUrl} alt={merchant?.name} className="w-full h-full object-cover rounded-xl" />
          {/* Overlay cho video và VR360 buttons */}
          <div className="absolute bottom-8 right-4 flex gap-2">
            <Button variant="secondary" size="small">
              {buttonName?.merchant.video}
            </Button>
            <Button onClick={async () => {
              // openWebview({url: "https://web-lanrungresort.vt360.vn/"})
              try {
                await openWebview({
                  url: "https://web-lanrungresort.vt360.vn/",
                  config: {
                    style: "bottomSheet",
                    leftButton: "back",
                  },
                });
              } catch (error) {
                // xử lý khi gọi api thất bại
                console.log(error);
              }
              // window.open("https://web-lanrungresort.vt360.vn/", '_blank');
            }} variant="secondary" size="small">
              {buttonName?.merchant.VR360}
            </Button>
          </div>
        </div>
      </div>

      {/* Resort Info Section */}
      <div className="px-4 relative z-10 bg-white rounded-t-[20px]">
        <Text.Title className="text-xl font-semibold pt-4">{merchant?.name}</Text.Title>
        <Text className="text-gray-600 mt-2">{merchant?.description}</Text>

        {/* Menu Grid */}
        <div className="grid grid-cols-4 gap-4 my-6">
          {menuOptions.map((option) => (
            <div key={option.id} className="flex flex-col items-center gap-2" onClick={() => navigate(`/${option.id}`, { replace: false })}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                {option.icon} {/* Render trực tiếp component icon */}
              </div>
              <Text size="small" style={{ textAlign: 'center' }}>
                {option.label}
              </Text>
            </div>
          ))}
        </div>

        {/* Follow OA Section */}
        {merchantOA && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4 w-full">
            <Text size="small" className="text-gray-500 mb-2">
              {merchantOA.followed ? 'Cảm ơn bạn đã quan tâm OA' : 'Quan tâm OA để nhận đặc quyền ưu đãi'}
            </Text>
            <div className="flex items-center gap-3">
              <img
                src={merchantOA.oa.avatarUrl}
                className="w-10 h-10 rounded-full object-cover"
                alt={merchantOA.oa.name}
              />
              <div className="flex-1">
                <Text className="font-medium">{merchantOA.oa.name}</Text>
                {/* <Text size="small" className="text-gray-500">
                  {merchantOA.followed ? 'Cảm ơn bạn đã quan tâm OA' : 'Quan tâm OA để quay thưởng'}
                </Text> */}
              </div>
              <Button
                style={{
                  backgroundColor: merchantOA.followed ? '#e5e7eb' : '#65BF68',
                  color: merchantOA.followed ? '#374151' : '#ffffff',
                }}
                variant={merchantOA.followed ? 'secondary' : 'primary'}
                onClick={merchantOA.followed ? undefined : handleFollow}
                disabled={merchantOA.followed}
                // prefix={merchantOA.followed ? <Icon icon="zi-check" /> : null}
              >
                {merchantOA.followed ? 'Đã quan tâm' : buttonName?.merchant.followOA}
              </Button>
            </div>
          </div>
        )}
        {/* Promotions Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Text.Title>Ưu đãi cho bạn</Text.Title>
            <Button style={{ color: '#65BF68' }} variant="tertiary" onClick={() => navigate(`/promotion`, { replace: false })}>
              {buttonName?.merchant.more}
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {/* Promotion Cards */}
            {promotionSuggest?.map((promotion, index) => 
              <PromotionSuggestCard 
                promotion={promotion} 
                onClick={() => {
                  // console.log('click promotion', promotion.id)
                  const url = `/promotion#${promotion.id}`
                  navigate(url, { animate: false, replace: false })
                }}
              />
            )}
          </div>
        </div>
        <SharePopup
          thumbnail={merchant?.coverUrl}
          name={merchant?.name}
          description={merchant?.description.length > 20 ? merchant?.description.substring(0, 20) + '...' : merchant?.description}

        />

        {/* Contact Info */}
        <div className="text-center pb-6">
          <img src={merchant?.logoUrl} className="w-20 mx-auto mb-4" />
          <div className="space-y-2">
            <Text>Hotline: {merchant?.phone}</Text>
            <Text>Zalo OA: {merchant?.zaloId}</Text>
            <Text>Email: {merchant?.email}</Text>
            <Text>{merchant?.address}</Text>
          </div>
        </div>
        <div className="text-center pb-6">
          <img
            className="w-80 mx-auto mb-4"
            src={
              'https://du-lich.chudu24.com/f/m/2308/29/the-cliff-resort-residences-mui-ne-0.png'
            }
          />
        </div>
        <div className="text-center pb-6">
          <Text>2025 © Copyright The Cliff Resort.</Text>
        </div>
      </div>
    </div>
  )
}
