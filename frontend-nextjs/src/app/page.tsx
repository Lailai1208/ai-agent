// src/app/page.tsx
'use client';

import {
  HomePageHeader,
  ThemeControlCard,
  LocalStorageCard,
  NotificationCard,
  UtilityTestCard,
  StyleTestsCard,
  SuccessCard,
} from '@/components/features/HomePage';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 標題區域 */}
        <HomePageHeader />

        {/* 功能測試區域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThemeControlCard />
          <LocalStorageCard />
          <NotificationCard />
          <UtilityTestCard />
        </div>

        {/* Tailwind CSS 樣式測試 */}
        <StyleTestsCard />

        {/* 成功提示 */}
        <SuccessCard />
      </div>
    </main>
  );
}
