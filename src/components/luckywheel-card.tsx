import React from 'react'
import { Box, Text, Button, useNavigate, useSnackbar } from 'zmp-ui'

import { IconBell } from '@/components/icons'
import { Service } from '@/types/service'
import { getUserInfo, showFunctionButtonWidget } from 'zmp-sdk/apis'
import { Wheel } from 'react-custom-roulette'
import { useOA } from '@/modules/oa/use-oa'
import { followOA, openChat } from 'zmp-sdk/apis'
import { notificationApi, bookingApi } from '@/services/api';
import { useButtonName } from '@/utils/use-button'
import SharePopup from './share-popup'

interface Prize {
  option: string
  style: {
    backgroundColor: string
    textColor: string
  }
}

export const LuckyWheelCard = ({ segments = 8, colors = ['#65BF68', '#ffffff'], spinTime = 5000 }) => {
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const { data: merchantOA, refetch } = useOA()
  
  function handleClick() {
    navigate('/service/1', { animate: false, replace: true })
  }
  const { data: buttonName } = useButtonName()
  const [mustSpin, setMustSpin] = React.useState(false)
  const [prizeNumber, setPrizeNumber] = React.useState(0)
  const [remainingPlays, setRemainingPlays] = React.useState(3)
  const [prizeName, setPrizeName] = React.useState('')
  const [isResult, setIsResult] = React.useState(false)
  const data: Prize[] = [
    {
      option: 'Voucher 200K',
      style: { backgroundColor: '#65BF68', textColor: 'white' },
    },
    {
      option: 'Voucher 100K',
      style: { backgroundColor: 'white', textColor: '#000000' },
    },
    {
      option: 'Voucher 500K',
      style: { backgroundColor: '#65BF68', textColor: 'white' },
    },
    {
      option: 'Chúc may mắn',
      style: { backgroundColor: 'white', textColor: '#000000' },
    },
    {
      option: 'Voucher 300K',
      style: { backgroundColor: '#65BF68', textColor: 'white' },
    },
    {
      option: 'Thêm lượt',
      style: { backgroundColor: 'white', textColor: '#000000' },
    },
    {
      option: 'Giảm 50%',
      style: { backgroundColor: '#65BF68', textColor: 'white' },
    },
    {
      option: 'Chúc may mắn',
      style: { backgroundColor: 'white', textColor: '#000000' },
    },
  ]

  const handleSpinClick = () => {
    if (remainingPlays <= 0) return

    // Random prize
    const newPrizeNumber = Math.floor(Math.random() * data.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
    setRemainingPlays((prev) => prev - 1)
  }

  async function handleFollow() {
    // console.log(merchantOA?.oa.id)
    if (!merchantOA) return
    try {
      await followOA({
        id: merchantOA.oa.id,
        success: () => {
          // console.log('Followed OA')
          refetch()
        },
        fail: (err) => {
          console.log(err)
        },
      })

      // await refetch()

      // Show success notification
      snackbar.openSnackbar({
        type: 'success',
        text: 'Đã quan tâm OA thành công',
      })

      // Gửi welcome message dựa trên merchant
      try {

        await openChat({
          type: 'oa',
          id: merchantOA.oa.id,
        })
      } catch (error) {
        console.error('Error sending welcome message:', error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {!isResult && (
        <Box className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
          {/* Header */}
          <Box className="w-full mb-8 flex items-center gap-2">
            {/* <img src="https://cdn-icons-png.flaticon.com/512/3159/3159502.png" alt="bell" className="w-8 h-8" /> */}
            <IconBell className="w-8 h-8" />
            <Text className="text-lg">
              Bạn còn lại <span className="text-red-500 font-bold">{remainingPlays} lượt chơi</span> trong tuần này
            </Text>
          </Box>

          {/* Wheel Container */}
          <Box className="relative w-full max-w-md mb-8">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              onStopSpinning={async() => {
                setMustSpin(false)
                // Handle prize logic here
                setPrizeName(data[prizeNumber].option)
                setIsResult(true)
                if (data[prizeNumber].option === 'Thêm lượt') {
                  setRemainingPlays((prev) => prev + 1)
                } else if (data[prizeNumber].option !== 'Chúc may mắn'){
                  const userInfo = await getUserInfo()
                  await notificationApi.sendLuckyWheelNotification({
                    merchantOA,
                    userId: userInfo.userInfo.id,
                    customerName: userInfo.userInfo.name,
                    promotionName: data[prizeNumber].option,
                  })
                }
                // Show prize modal or navigate to result page
              }}
              // Customize wheel
              outerBorderColor="#FFD700"
              outerBorderWidth={3}
              innerBorderColor="#FFD700"
              innerBorderWidth={2}
              innerRadius={0}
              radiusLineColor="#FFD700"
              radiusLineWidth={1}
              fontSize={14}
              textDistance={60}
              spinDuration={0.8}
            />

            {/* Center pointer */}
            <Box className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Box className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500" />
            </Box>
          </Box>

          {/* Title */}
          <Text className="text-xl font-bold mb-6">Vòng quay may mắn</Text>

          {merchantOA && (
            <div className="p-3 rounded-lg mb-4 w-full" style={{ backgroundColor: '#EDF8F2', borderColor: '#65BF68', borderWidth: '1px', borderStyle: 'solid' }}>
              <Text size="small" className="text-gray-500 mb-2">
                {merchantOA.followed ? 'Cảm ơn bạn đã quan tâm OA' : 'Quan tâm OA để quay thưởng'}
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
                  {merchantOA.followed ? 'Đã quan tâm' : 'Quan tâm'}
                </Button>
              </div>
            </div>
          )}

          {/* Play Button */}
          <Button
            className="w-32 bg-green-600 text-white disabled:bg-gray-400 mb-4"
            disabled={mustSpin || remainingPlays <= 0 || merchantOA?.followed === false}
            onClick={handleSpinClick}
          >
            {mustSpin ? 'Đang quay...' : buttonName?.luckywheel.spin}
          </Button>
          <SharePopup
            name="Vòng quay may mắn"
            description="Chơi ngay để nhận ưu đãi hấp dẫn"
            thumbnail="https://i.pinimg.com/736x/93/82/d8/9382d87eaf0661e468b590b2244914f7.jpg"
          />
          {/* Instructions */}
          {remainingPlays <= 0 && <Text className="mt-4 text-red-500">Bạn đã hết lượt chơi trong tuần này</Text>}
        </Box>
      )}

      {isResult && (
        <Box className="flex flex-col items-center min-h-screen bg-white p-4">
          {/* Fireworks */}
          <Box className="w-full flex justify-between mb-4">
            <img
              src="https://static.vecteezy.com/system/resources/previews/000/552/753/non_2x/exploding-fireworks-logo-vector-icon.jpg"
              alt="firework"
              className="w-24 h-24"
            />
            <img
              src="https://static.vecteezy.com/system/resources/previews/000/552/753/non_2x/exploding-fireworks-logo-vector-icon.jpg"
              alt="firework"
              className="w-24 h-24"
            />
          </Box>

          {/* Congratulations Text */}
          <Text className="text-2xl font-bold mb-8">Chúc mừng!</Text>

          {/* Voucher Card */}
          <Box className="w-full max-w-md bg-gradient-to-r from-red-500 to-pink-300 rounded-lg p-6 mb-8">
            <Box className="flex items-center mb-4">
              {/* <img src="/voucher-icon.png" alt="voucher" className="w-8 h-8" /> */}
              <Text className="text-white text-xl ml-2">VOUCHER</Text>
            </Box>

            <Text className="text-center text-xl mb-4">Bạn nhận được</Text>
            <Text className="text-center font-bold text-2xl mb-6">
              {/* Voucher giảm giá <span className="text-red-600">200K</span> */}
              <span className="text-red-600">{prizeName}</span>
            </Text>
          </Box>

          {/* Follow OA Section */}
          {/* <Text className="text-gray-600 mb-4">Nhấn quan tâm OA để nhận thưởng</Text> */}

          {/* OA Info */}
          {/* <Box className="flex items-center gap-3 mb-6">
            <img
              src="https://s3-alpha-sig.figma.com/img/1555/32d6/c4e2ad6045f2bd89cda6a34fa9cbc68c?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hEo-8Q3MYOHsgKA2gtP98t4TFq9s8XF6wdglB4XBemHOsa3sB~zXVp6MXHOfzYkhpJuGdwsN0OES4tKPTeryyMlXaYCRJDGeRJjsySzDoeyjXwq7BAxD8eieNx~o80nIErkLA5mfiK1tXjYvg5ahH8dgsU-aJPaK7Ii6h4tp7piEu6jw5F~acYwhsiSfsr0CoO-Ax4oAhYG6Ymd-7cdo88Oc-6Detbk5G~eh6psug9VZmNVloFRZYE7fKfHir2bSlVnUMAMdfgrV01toBSOUIxpBnD1nujIi6akNaIMGkAj209Cyyg0DSqyG3Pp0i0ZfY6~vuRNWlAwsZ9jvvBweJg__"
              alt="The Cliff Resort"
              className="w-12 h-12 rounded-full"
            />
            <Text className="font-medium">The Cliff Resort Mũi Né</Text>
          </Box> */}

          {/* Follow Button */}
          {/* <Button
            className="w-full max-w-xs bg-green-600 text-white"
            onClick={() => {
              
            }}
          >
            Quan tâm
          </Button> */}
          
        </Box>
      )}
    </>
  )
}
