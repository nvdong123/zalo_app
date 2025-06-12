import React, { FC } from 'react';
import { openShareSheet } from 'zmp-sdk/apis';
import { Modal, Button, Icon, Text, useSnackbar } from 'zmp-ui';
// import './custom.css';
import { IconZalo } from './icons/icon-zalo';
import { IconCopy } from './icons/icon-copy';
import { useOA } from '@/modules/oa/use-oa';
import {useServiceDetail} from '@/modules/serviceDetails/use-services';
import { useEffect, useState } from 'react';
import { Box } from 'zmp-ui';
import { IconShare } from './icons/icon-share';
import { useLoaderData } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import zmp from 'zmp-sdk';
import { useQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { ButtonName } from '@/types/button-name'






interface SharePopupProps {
           // Đường dẫn cần chia sẻ
  thumbnail: string;      // Ảnh thumbnail
  description: string;    // Mô tả
  name: string;           // Tên sản phẩm
}

interface Cover {
  cover: string;
}

const useCoverSharePopup = () => {
  return useQuery({
    queryKey: ['cover-share-popup'],
    queryFn: async () => {
      const res = await request<Cover>(`/cover-share-popup`);
      // console.log(res)
      return res
    },
  })
}

const SharePopup: FC<SharePopupProps> = ({ name, thumbnail, description }) => {
  


  const [openShare, setOpenShare] = useState(false);
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
  const {data: merchantOA} = useOA();
  const id = window.location.pathname.split('/').pop();
    // console.log(id)
  
  const {data: cover, refetch} = useCoverSharePopup();
  refetch()
  // Hàm copy link vào clipboard

  const onClose = () => {
    setOpenShare(false);
  }

  const handleCopyLink = () => {
    const url = `https://zalo.me/s/2694669897656002120/${location.pathname}`; // location lấy từ useLocation
    const tempInput = document.createElement("textarea");
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    onClose()
    openSnackbar({
      type: 'success',
      text: 'Đã sao chép đường dẫn'
    });
  }
  // Giả lập hàm share lên Zalo
  const shareCurrentPage = async () => {
    // console.log(name, description, thumbnail)
    try {
      const currentPath = window.location.pathname;
    
      // Create the deep link to share
      const deeplink = `zalo://miniapp?id=2694669897656002120&path=${encodeURIComponent(currentPath)}`;
      
      
      const data = await openShareSheet({
        type: "zmp_deep_link",
        data: {
          title: name || '',
          description: description || '',
          thumbnail: thumbnail || '',
        },
      });
      // console.log("123")
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Box 
          className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg mb-6 "
          onClick={() => setOpenShare(true)}
        >
        <IconShare className="text-purple-600" size={24} />
        <Text className="text-purple-600 flex-1">Chia sẻ ngay cho bạn bè</Text>
        <Icon icon="zi-arrow-right" className="text-purple-600" />
      </Box>
      <Modal
        className='share-popup'
          visible={openShare}
          onClose={onClose}
          zIndex={1200}
    
          actionsDivider={false}
          width={'90vw'}
          modalClassName='p-0'
      > 
        
        <img
            className='object-cover h-35 w-full mb-2'
            src={cover?.cover}
        />
        <div className='flex flex-col items-center'>
          
          <h2 className='my-1'>Chia sẻ đường dẫn</h2>
          <p className='mt-1 mb-4 text-center'>Hãy chia sẻ ngay đường dẫn cho bạn bè để biết thêm thông tin về sản phẩm</p>
        </div>
        <div className='flex gap-2 my-1'>
          <Button
            className='w-1/2 h-[145px]
            bg-white text-white rounded-md font-semibold py-1 px-3 
            border border-[#2F8A3A] border-solid rounded-md
            hover:bg-transparent
            '
            onClick={handleCopyLink}
          >
            <div className='flex justify-center items-center flex-col gap-3'>
              <IconCopy size={50} className='text-[#2F8A3A]' />
              <h3 className='text-wrap break-words text-[#2F8A3A] m-0 text-base'>Sao chép <br/> đường dẫn</h3>
            </div>
          </Button>
          <Button
            className='w-1/2 h-[145px]
            bg-[#2F8A3A] text-white rounded-md font-semibold py-1 px-3 
            border border-[#2F8A3A] border-solid rounded-md
            hover:bg-[#2F8A3A] hover:!bg-[#2F8A3A] hover:text-white
            '
            onClick={shareCurrentPage}
          >
            <div className='flex justify-center items-center flex-col gap-3'>
              <IconZalo size={50} className='text-[#2F8A3A]' />
              <h3 className='text-wrap break-words m-0 text-base'>Chia sẻ nhanh bạn bè trên Zalo</h3>
            </div>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SharePopup;
