import React from 'react';
import { Button, Icon } from 'zmp-ui';
import { getUserInfo } from 'zmp-sdk/apis';
import { userInfo } from 'os';
import { IconPhoneCall } from '@/components/icons/icon-phone-call'
import { IconWhatApps } from '@/components/icons/icon-what-apps'
import { IconHomePage } from '@/components/icons/icon-home-page'
import { IconSimpleZalo } from '@/components/icons/icon-simple-zalo'
import { IconDirection } from '@/components/icons/icon-direction'
import { IconPercentage } from '@/components/icons/icon-percentage'
import { IconBooking } from '@/components/icons/icon-booking'
import { IconBell, IconMinigame} from './icons';
import { IconService } from './icons';
import { IconNews } from '@/components/icons/icon-news';
import { useOA } from '@/modules/oa/use-oa';
import { Routes } from '@/constants/routes';
import { useNavigate } from 'zmp-ui'
import { on } from 'events';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  arrowVisible: boolean;
}



const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, arrowVisible }) => {

  const navigate = useNavigate()

  const handleClick = (tab: string) => {
    let url = Routes.merchant.page()
      switch (tab) {
        case 'homepage':
          url = Routes.merchant.homepage()
          break
        case 'booking':
          url = Routes.merchant.booking()
          break
        case 'promotion':
          url = Routes.merchant.promotion()
          break
        case 'service':
          url = Routes.merchant.service()
          break
        case 'info':
          url = Routes.merchant.info()
        case 'luckywheel':
          url = Routes.merchant.luckywheel()
          break
        default:
          break
      }
      navigate(url, { animate: true, replace: false });
      onToggle();

  }

  const { data: merchantOA, refetch } = useOA();
  // console.log(merchantOA)

  return (
    <div
      className="fixed top-0 left-0 h-screen bg-white shadow-md transition-transform duration-500 ease-in-out z-[10000]"
      style={{
        width: "20rem", // tương đương với w-64 (16rem)
        // Khi đóng, dịch sidebar sang trái sao cho chỉ còn lại 2.5rem hiển thị (nút mũi tên)
        transform: isOpen ? "translateX(0)" : "translateX(calc(-100%))",
      }}
    >
      {/* Nút mũi tên toggle nằm bên cạnh phải của sidebar */}
      <button
        onClick={onToggle}
        className={"rounded-full absolute top-1/2 right-1 transform -translate-y-1/2 bg-green-100 border border-[#65BF68]  p-2 shadow  z-50"}
        style={{ 
          transition: "right 0.3s, margin-right 0.3s, transform 0.5s", // Animation cho nút mũi tên
          marginRight: isOpen ? "-1.25rem" : "-2.5rem", // Khi đóng, dịch nút mũi tên sang phải 2.5rem
          transform: `translateX(${arrowVisible ? '0' : isOpen ? '0' : '-100%'}) translateY(-50%)`,
        }}
      >
        <Icon icon="zi-arrow-right" 
          className={"text-[#65BF68] transform rotate-0 transition-transform duration-500 ease-in-out " + (isOpen ? "rotate-180" : "rotate-0")}
        />
    
      </button>

      {/* Nội dung của Sidebar */}
      <div className="p-4 pt-12">
        {/* Header chứa avatar và thông tin người dùng */}
        <div className="flex items-center space-x-4 border-b pb-4">
          <img
            src={merchantOA?.oa.userInfo.avatar || ""}
            alt="avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-lg m-0">{merchantOA?.oa.userInfo.name}</h3>
            {/* <p className="text-sm text-gray-600 m-0"></p> */}
          </div>
        </div>
        {/* Menu */}
        <div className="mt-4 flex flex-col space-y-1">
          <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
            onClick={() => handleClick('homepage')}
          >
            <div className='w-1/6 '>
              <IconHomePage size={35}/>
            </div>
            <p className='text-lg m-1'>Trang chủ</p>
          </div> 
          <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
            onClick={() => handleClick('booking')}
          >
            <div className='w-1/6'>
              <IconBooking size={30}/>
            </div>
            <p className='text-lg m-1'>Đặt phòng</p>
          </div>
          <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
            onClick={() => handleClick('promotion')}
          >
            <div className='w-1/6'>
              <IconPercentage size={30}/>
            </div>
            <p className='text-lg m-1'>Ưu đãi</p>
          </div>
          <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
            onClick={() => handleClick('service')}
          >
            <div className='w-1/6'>
              <IconService size={30}/>
            </div>
            <p className='text-lg m-1'>Dịch vụ</p>
          </div>
          {/* <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
            onClick={() => handleClick('homepage')}
          >
            <div className='w-1/6'>
              <IconNews size={30} />
            </div>
            <p className='text-lg m-1'>Tin tức</p>
          </div> */}
          <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
            onClick={() => handleClick('luckywheel')}
          >
            <div className='w-1/6'>
              <IconMinigame size={30} />
            </div>
            <p className='text-lg m-1'>Vòng quay may mắn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
