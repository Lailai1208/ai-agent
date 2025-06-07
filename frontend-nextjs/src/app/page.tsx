// src/app/page.tsx
'use client';

import { Button, Title, Card, Group, Text, Badge } from '@mantine/core';
import { useApp } from '@/context/AppContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDate } from '@/utils/helpers';
import { APP_NAME } from '@/lib/constants';
import { notifications } from '@mantine/notifications';

export default function Home() {
  const { theme, toggleTheme } = useApp();
  const [count, setCount] = useLocalStorage('count', 0);

  const handleNotification = () => {
    notifications.show({
      title: '測試通知',
      message: '所有功能都正常運作！',
      color: 'green',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 標題區域 */}
        <div className="text-center">
          <Title order={1} className="mb-4 text-gray-800">
            🎉 {APP_NAME}
          </Title>
          <Text size="lg" className="text-gray-600">
            Mantine + Tailwind CSS + TypeScript 完美整合
          </Text>
          <Badge color="blue" variant="light" className="mt-2">
            {formatDate(new Date())}
          </Badge>
        </div>

        {/* 功能測試區域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} className="mb-4">
              🎨 主題控制
            </Title>
            <Text className="mb-4">
              目前主題: <strong>{theme}</strong>
            </Text>
            <Button onClick={toggleTheme} variant="light" color="blue">
              切換主題
            </Button>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} className="mb-4">
              💾 本地儲存測試
            </Title>
            <Text className="mb-4">
              計數器: <strong>{count}</strong>
            </Text>
            <Group gap="sm">
              <Button
                onClick={() => setCount(count + 1)}
                variant="filled"
                color="green"
              >
                增加
              </Button>
              <Button
                onClick={() => setCount(Math.max(0, count - 1))}
                variant="outline"
                color="red"
              >
                減少
              </Button>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} className="mb-4">
              🔔 通知系統
            </Title>
            <Text className="mb-4">測試 Mantine 通知功能</Text>
            <Button
              onClick={handleNotification}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              顯示通知
            </Button>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} className="mb-4">
              🛠 工具函式測試
            </Title>
            <Text className="mb-2">
              <strong>格式化日期:</strong> {formatDate(new Date())}
            </Text>
            <Text className="mb-2">
              <strong>應用程式名稱:</strong> {APP_NAME}
            </Text>
            <Text>
              <strong>環境:</strong> {process.env.NODE_ENV}
            </Text>
          </Card>
        </div>

        {/* Tailwind CSS 樣式測試 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} className="mb-4">
            🎨 Tailwind CSS + Mantine 整合測試
          </Title>

          <div className="space-y-4">
            {/* 測試混合樣式 */}
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-lg text-white">
              <Text className="font-bold">Tailwind 漸層背景</Text>
              <Text size="sm">這是使用 Tailwind CSS 類別的漸層背景</Text>
            </div>

            {/* 測試響應式網格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded text-center">
                <Text className="font-semibold text-blue-800">響應式</Text>
              </div>
              <div className="bg-green-100 p-4 rounded text-center">
                <Text className="font-semibold text-green-800">網格</Text>
              </div>
              <div className="bg-orange-100 p-4 rounded text-center">
                <Text className="font-semibold text-orange-800">佈局</Text>
              </div>
            </div>

            {/* 測試 Mantine 元件 + Tailwind 類別 */}
            <Group justify="center" className="mt-6">
              <Button
                variant="filled"
                color="blue"
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Mantine + Tailwind 按鈕
              </Button>
              <Button
                variant="outline"
                color="green"
                className="border-2 hover:border-green-400 transition-colors"
              >
                混合樣式按鈕
              </Button>
            </Group>
          </div>
        </Card>

        {/* 成功提示 */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-green-50 border-green-200"
        >
          <div className="text-center">
            <Title order={2} className="text-green-800 mb-2">
              ✅ 設置完成！
            </Title>
            <Text className="text-green-700">
              如果您能看到這個頁面且所有功能都正常運作，表示您的 Next.js
              專案設置成功！
            </Text>
            <Text size="sm" className="text-green-600 mt-2">
              Mantine 元件、Tailwind CSS 樣式、TypeScript
              類型檢查、狀態管理都已正常運作
            </Text>
          </div>
        </Card>
      </div>
    </main>
  );
}

// Test Next.js + Mantine + Tailwind CSS setup
// // src/app/page.tsx
// import { Button, Title } from '@mantine/core'; // 引入 Mantine 元件

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-gray-50 p-8"> {/* Tailwind 類別 */}
//       <div className="max-w-4xl mx-auto"> {/* Tailwind 類別 */}
//         <Title order={1} className="mb-6 text-blue-600"> {/* Mantine + Tailwind */}
//           歡迎來到我的 Side Project！
//         </Title>

//         <div className="space-y-4"> {/* Tailwind 類別 */}
//           <Button variant="filled" color="blue"> {/* Mantine 按鈕 */}
//             Mantine 按鈕
//           </Button>

//           <Button
//             variant="outline"
//             className="border-green-500 text-green-500 hover:bg-green-50" // Tailwind 覆寫樣式
//           >
//             混合樣式按鈕
//           </Button>
//         </div>
//       </div>
//     </main>
//   );
// }

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
