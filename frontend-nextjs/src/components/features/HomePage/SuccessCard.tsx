// src/components/features/HomePage/SuccessCard.tsx
'use client';

import { Title, Card, Text } from '@mantine/core';

export function SuccessCard() {
  return (
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
  );
}
