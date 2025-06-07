// src/app/providers.tsx (完整版本)
'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProvider } from '@/context/AppContext'; // 引入 AppProvider
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        {' '}
        {/* 包裹 AppProvider */}
        <MantineProvider
          defaultColorScheme="light" // 可以設定為 'light' | 'dark' | 'auto'
          theme={{
            // colorScheme: 'light', // 可以設定為 'light' | 'dark' | 'auto'
            fontFamily: 'Inter, system-ui, sans-serif',
            primaryColor: 'blue',
          }}
        >
          <Notifications position="top-right" zIndex={1000} />
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </MantineProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

// import { MantineProvider } from '@mantine/core';
// import { Notifications } from '@mantine/notifications';

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <MantineProvider
//       defaultColorScheme="light"  // 可以設定為 'light' | 'dark' | 'auto'
//       theme={{
//         // colorScheme: 'light', // 可以設定為 'light' | 'dark' | 'auto'
//         fontFamily: 'Inter, system-ui, sans-serif',
//         primaryColor: 'blue',
//         // 可以在這裡自訂更多主題設定
//       }}
//     >
//       <Notifications position="top-right" zIndex={1000} />
//       {children}
//     </MantineProvider>
//   );
// }
