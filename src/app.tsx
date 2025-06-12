// src/app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'
import { AnimationRoutes, App, SnackbarProvider, ZMPRouter } from 'zmp-ui'
import { RootProvider } from './components'
import Sidebar from './components/side-bar'
import { useEffect } from 'react'
// import { zmp } from 'zmp-sdk/apis'

// Initialize SDK
// zmp.init({appId: '3125557895508014743'})

// Lazy load các pages để tối ưu performance
const MerchantInfoPage = React.lazy(() => import('./pages/info'))
const BookingRootPage = React.lazy(() => import('./pages/booking'))
const ServicePage = React.lazy(() => import('./pages/service'))
const ServiceDetailPage = React.lazy(() => import('./pages/service.detail'))
const PromotionPage = React.lazy(() => import('./pages/promotion'))
const LuckywheelPage = React.lazy(() => import('./pages/luckywheel'))
// import { ServicePage } from './modules/services/components/service-page'

// Cấu hình Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      // Thêm các options phổ biến
      staleTime: 5 * 60 * 1000, // 5 minutes
      // cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

// Loading component cho Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <span className="loading loading-spinner"></span>
  </div>
)

// Routes configuration
const routes = [
  {
    path: '/',
    element: <MerchantInfoPage />,
  },
  {
    path: '/booking',
    element: <BookingRootPage />,
  },
  {
    path: '/info',
    element: <MerchantInfoPage />,
  },
  {
    path: '/service',
    element: <ServicePage />
  },
  {
    path: '/promotion',
    element: <PromotionPage />
  },
  {
    path: '/service/:id',
    element: <ServiceDetailPage/>
  },
  {
    path: '/luckywheel',
    element: <LuckywheelPage />
  }
]

const MyApp = () => {
  const [sideBarOpen, setSideBarOpen] = React.useState(false)
  const [arrowVisible, setArrowVisible] = React.useState(false)

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    const handleInteraction = () => {
      setArrowVisible(true);
      // Xóa timer cũ nếu có và đặt timer mới để ẩn nút sau 2 giây không có tương tác
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setArrowVisible(false);
      }, 2000);
    };

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <App>
      <Suspense fallback={<LoadingFallback />}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            <RootProvider>
              <ZMPRouter>
                <AnimationRoutes>
                  {routes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
                </AnimationRoutes>
                {sideBarOpen && (
                  <div
                    className="fixed inset-0 bg-black opacity-50 z-[9999]" 
                    onClick={() => setSideBarOpen(false)}
                  />
                )}

                <Sidebar 
                  isOpen={sideBarOpen}
                  onToggle={() => setSideBarOpen(!sideBarOpen)}
                  arrowVisible={arrowVisible}
                />
              </ZMPRouter>
            </RootProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </Suspense>
    </App>
  )
}

export default MyApp